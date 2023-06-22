import Player from "./Player";
import MainScene from "../scenes/MainScene";
import Beam from "./Beam";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  beamGroup: Phaser.Physics.Arcade.Group;
  maxVelocity = 100;
  velocity = 0;
  player: Player;
  beamTimer = 0;
  beamCooldown = 2000;
  attackAngle = Phaser.Math.DegToRad(20);
  enemyGroup: Phaser.Physics.Arcade.Group;
  health = 2;
  scoreText: Phaser.GameObjects.Text;
  worldWidth: number;
  worldHeight: number;
  locationOffset = 100;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player,
    worldWidth: number,
    worldHeight: number,
    enemyGroup: Phaser.Physics.Arcade.Group,
    beamGroup: Phaser.Physics.Arcade.Group,
    scoreText: Phaser.GameObjects.Text
  ) {
    super(scene, x, y, "enemy-ship");
    this.scoreText = scoreText;
    this.scene.add.existing(this);
    this.player = player;
    this.scene.physics.add.existing(this);
    this.enemyGroup = enemyGroup;
    this.enemyGroup.add(this);
    this.beamGroup = beamGroup;
    this.worldHeight = worldHeight;
    this.worldWidth = worldWidth;
    this.setScale(0.4);
    this.setInteractive();
    this.setRotation(Phaser.Math.Angle.Random());
    this.setRandomLocation();
    this.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.buttons == 2) {
        if (!this.player.cooldown.homingBeam) {
          this.player.generateHomingBeam(this);
        }
      }
    });
  }

  update(time: number, deltaT: number) {
    const targetAngle = Phaser.Math.Angle.BetweenPoints(
      this.getCenter(),
      this.player?.getCenter()!
    );
    this.move(targetAngle);
    this.collideWithWorld();
    // this.generateBeam(targetAngle, deltaT);
  }

  move(targetAngle: number) {
    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      targetAngle,
      0.01
    );
    if (
      Phaser.Math.Distance.BetweenPoints(
        this.getCenter(),
        this.player.getCenter()
      ) < 300
    ) {
      this.velocity = 0;
    } else {
      this.velocity = this.maxVelocity;
    }
    this.setVelocity(
      this.velocity * Math.cos(this.rotation),
      this.velocity * Math.sin(this.rotation)
    );
  }

  collideWithWorld() {
    const minX = this.displayWidth / 2;
    const maxX = this.worldWidth - this.displayWidth / 2;
    const minY = this.displayHeight / 2;
    const maxY = this.worldHeight - this.displayHeight / 2;

    if (this.x >= maxX) {
      this.x = maxX;
    } else if (this.x <= minY) {
      this.x = minX;
    }

    if (this.y >= maxY) {
      this.y = maxY;
    } else if (this.y <= minY) {
      this.y = minY;
    }
  }

  generateBeam(targetAngle: number, deltaT: number) {
    const diffAngle = Math.abs(this.rotation - targetAngle);
    const fire =
      diffAngle < this.attackAngle ||
      2 * Math.PI - diffAngle < this.attackAngle;
    this.beamTimer += deltaT;
    if (this.beamTimer > this.beamCooldown && fire) {
      new Beam(
        this.scene,
        this.getRightCenter().x!,
        this.getRightCenter().y!,
        "enemy-beam",
        this.rotation,
        this.worldWidth,
        this.worldHeight,
        this.beamGroup
      );
      this.beamTimer = 0;
    }
  }
  generatePosition() {
    const y = Phaser.Math.Between(
      this.displayHeight / 2 + this.locationOffset,
      this.worldHeight - this.displayHeight / 2 - this.locationOffset
    );
    const x = Phaser.Math.Between(
      this.displayWidth / 2 + this.locationOffset,
      this.worldWidth - this.displayWidth / 2 - this.locationOffset
    );
    return {
      x,
      y,
    };
  }

  overlapsEnemy(position: { x: number; y: number }) {
    const minDistance =
      Math.sqrt(
        Math.pow(this.displayWidth, 2) + Math.pow(this.displayHeight, 2)
      ) + this.locationOffset;

    let distanceBetweenSprites: number;
    const enemies = this.enemyGroup.getChildren();
    for (const enemy of enemies) {
      if (enemy !== this) {
        distanceBetweenSprites = Phaser.Math.Distance.BetweenPoints(
          position,
          (enemy as Phaser.Physics.Arcade.Sprite).getCenter()
        );
        if (distanceBetweenSprites < minDistance) return true;
      }
    }
    return false;
  }
  overlapsPlayer(position: { x: number; y: number }) {
    const minDistance =
      Math.sqrt(
        Math.pow(this.displayWidth / 2 + this.player.displayWidth / 2, 2) +
          Math.pow(this.displayHeight / 2 + this.player.displayHeight / 2, 2)
      ) + this.locationOffset;
    const distanceBetweenSprites = Phaser.Math.Distance.BetweenPoints(
      position,
      this.player.getCenter()
    );
    if (distanceBetweenSprites < minDistance) return true;
    return false;
  }
  setRandomLocation() {
    let position = this.generatePosition();
    while (this.overlapsEnemy(position) || this.overlapsPlayer(position)) {
      position = this.generatePosition();
    }
    this.x = position.x;
    this.y = position.y;
  }

  containsPoint(point: { x: number; y: number }) {
    const { left, right, top, bottom } = this.getBounds();
    return (
      point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
    );
  }

  reduceHealth(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      if (this.scene instanceof MainScene) {
        this.scene.score! += 10;
        this.scoreText.setText("" + this.scene.score);
      }
      this.destroy();
    }
  }
}
