import { postRequest } from "@/lib/apiRequests";
import Cooldown from "../Cooldown";
import Beam from "./Beam";
import MainScene from "../scenes/MainScene";
import Enemy from "./Enemy";
import HomingBeam from "./HomingBeam";
import { wait } from "@/components/Game";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  health: number;
  maxHealth = 10;
  maxHealthWidth = 200;
  healthStep = this.maxHealthWidth / this.maxHealth;
  healthBar: Phaser.GameObjects.Rectangle;
  velocity = 0;
  maxVelocity = 300;
  angularVelocity = 0;
  maxAngularVelocity = 100;
  wKey?: Phaser.Input.Keyboard.Key;
  sKey?: Phaser.Input.Keyboard.Key;
  aKey?: Phaser.Input.Keyboard.Key;
  dKey?: Phaser.Input.Keyboard.Key;
  spaceKey?: Phaser.Input.Keyboard.Key;
  shiftKey?: Phaser.Input.Keyboard.Key;
  beamCooldown = 300;
  beamTimer = 0;
  beamGroup: Phaser.Physics.Arcade.Group;
  enemyGroup: Phaser.Physics.Arcade.Group;
  homingBeamGroup: Phaser.Physics.Arcade.Group;
  cooldown = { homingBeam: false, teleport: false };
  cooldownGroup: Cooldown[] = [];
  worldWidth: number;
  worldHeight: number;

  constructor(
    scene: Phaser.Scene,
    health: number,
    posX: number,
    posY: number,
    worldWidth: number,
    worldHeight: number,
    playerGroup: Phaser.Physics.Arcade.Group,
    beamGroup: Phaser.Physics.Arcade.Group,
    homingBeamGroup: Phaser.Physics.Arcade.Group,
    enemyGroup: Phaser.Physics.Arcade.Group,
    statusBarItemsYPosition: number
  ) {
    super(scene, posX, posY, "player-ship");
    this.health = health;
    this.worldHeight = worldHeight;
    this.worldWidth = worldWidth;
    playerGroup.add(this);
    this.homingBeamGroup = homingBeamGroup;
    this.beamGroup = beamGroup;
    this.enemyGroup = enemyGroup;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds();
    this.wKey = this.scene.input.keyboard?.addKey("W", false);
    this.sKey = this.scene.input.keyboard?.addKey("S", false);
    this.aKey = this.scene.input.keyboard?.addKey("A", false);
    this.dKey = this.scene.input.keyboard?.addKey("D", false);
    this.shiftKey = this.scene.input.keyboard?.addKey("SHIFT", false);
    this.spaceKey = this.scene.input.keyboard?.addKey("SPACE", false);
    this.setScale(0.5);
    this.healthBar = this.scene.add
      .rectangle(
        +this.scene.game.config.width / 2 + 250,
        statusBarItemsYPosition,
        this.health * this.healthStep,
        50,
        0x00ff00
      )
      .setOrigin(0);

    this.rotation = Phaser.Math.Angle.Random();
  }

  update(time: number, deltaT: number) {
    this.move();
    this.rotate();
    this.generateBeam(deltaT);
    this.cooldownGroup.forEach((cooldown) => cooldown.update(deltaT));
  }

  move() {
    if (this.wKey?.isDown) {
      this.velocity = this.maxVelocity;
    } else if (this.sKey?.isDown) {
      this.velocity = -this.maxVelocity;
    } else {
      this.velocity = 0;
    }

    this.setVelocity(
      this.velocity * Math.cos(this.rotation),
      this.velocity * Math.sin(this.rotation)
    );
  }

  rotate() {
    if (this.aKey?.isDown) {
      this.angularVelocity = -this.maxAngularVelocity;
    } else if (this.dKey?.isDown) {
      this.angularVelocity = this.maxAngularVelocity;
    } else {
      this.angularVelocity = 0;
    }

    this.setAngularVelocity(this.angularVelocity);
  }
  generateBeam(delta: number) {
    if (this.spaceKey?.isDown && this.beamTimer > this.beamCooldown) {
      new Beam(
        this.scene,
        this.getRightCenter().x!,
        this.getRightCenter().y!,
        "player-beam",
        this.rotation,
        this.worldWidth!,
        this.worldHeight!,
        this.beamGroup!
      );
      this.beamTimer = 0;
    }
    this.beamTimer += delta;
  }

  generateHomingBeam(enemy: Phaser.Physics.Arcade.Sprite) {
    new HomingBeam(
      this.scene,
      this.getRightCenter().x!,
      this.getRightCenter().y!,
      this.rotation,
      enemy,
      this.homingBeamGroup
    );
    new Cooldown("homing-beam", this.scene, this.cooldown, this.cooldownGroup);
    this.cooldown.homingBeam = true;
  }

  teleport(projectedCenter: { x: number; y: number }) {
    const { x, y } = projectedCenter;
    const deltaX = this.displayWidth / 2;
    const deltaY = this.displayHeight / 2;
    const projectedTopLeft = {
      x: x - deltaX,
      y: y - deltaY,
    };
    const projectedTopRight = {
      x: x + deltaX,
      y: y - deltaY,
    };
    const projectedBottomLeft = {
      x: x - deltaX,
      y: y + deltaY,
    };
    const projectedBottomRight = {
      x: x + deltaX,
      y: y + deltaY,
    };

    const playerPoints = [
      projectedTopLeft,
      projectedTopRight,
      projectedCenter,
      projectedBottomLeft,
      projectedBottomRight,
    ];

    const enemies = this.enemyGroup.getChildren();
    for (let i = 0; i < playerPoints.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        if ((enemies[j] as Enemy).containsPoint(playerPoints[i])) {
          return console.log("overlaps");
        }
      }
    }
    this.cooldown.teleport = true;
    new Cooldown("teleport", this.scene, this.cooldown, this.cooldownGroup);
    this.x = x;
    this.y = y;
  }
  async addHighScoreWhenUnAuthenticated(score: number) {
    try {
      const { highScore } = await postRequest(
        "/api/high-scores/check-if-valid",
        {
          score,
        }
      );
      this.scene.scene.start("LeaderboardScene", {
        win: highScore,
        promptForUsername: highScore,
        score,
      });
      this.scene.scene.stop("GameOverScene");
    } catch (error) {
      window.showBoundary(error);
    }
  }
  async addHighScoreWhenAuthenticated(username: string, score: number) {
    try {
      const { added } = await postRequest("/api/high-scores", {
        username,
        score,
      });
      this.scene.scene.start("LeaderboardScene", { win: added });
      this.scene.scene.stop("GameOverScene");
    } catch (error) {
      window.showBoundary(error);
    }
  }

  async reduceHealth(amount: number) {
    this.health -= amount;
    this.healthBar.width = this.health * this.healthStep;
    if (this.health <= 0) {
      this.scene.scene.pause();
      this.scene.scene.stop("ControlsBar");
      this.scene.scene.run("GameOverScene");
      this.scene.scene.bringToTop("GameOverScene");
      await wait(1000);
      const score = (this.scene as MainScene).score;
      if (score === 0) {
        this.scene.scene.start("LeaderboardScene", { win: false });
        this.scene.scene.stop("GameOverScene");
        return;
      }
      if (window.user) {
        const { username } = window.user;
        return this.addHighScoreWhenAuthenticated(username, score);
      }
      this.addHighScoreWhenUnAuthenticated(score);
    }
  }
}
