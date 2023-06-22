import Player from "../sprites/Player";
import Enemy from "../sprites/Enemy";

export default class MainScene extends Phaser.Scene {
  enemies?: Phaser.Physics.Arcade.Group;
  player?: Player;
  score = 0;
  pauseButton?: Phaser.GameObjects.DOMElement;
  level = 0;
  playerHealth = 0;

  constructor() {
    super("MainScene");
  }
  init({
    score,
    level,
    playerHealth,
  }: {
    score?: number;
    level?: number;
    playerHealth?: number;
  }) {
    this.score = score ?? 0;
    this.level = level ?? 1;
    this.playerHealth = playerHealth ?? 10;
  }
  preload() {
    this.load.image("stars", "/images/Stars_nebulae/stars.png");
    this.load.image("player-ship", "/images/alien_ships/playership.png");
    this.load.image("enemy-ship", "images/alien_ships/enemyship.png");
    this.load.image("player-beam", "/images/Muzzle_flashes/playerBeam.png");
    this.load.image("enemy-beam", "/images/Muzzle_flashes/enemyBeam.png");
    this.load.image("homing-beam-icon", "/images/homingBeamIcon.jpg");
    this.load.image("teleport-icon", "/images/teleportIcon.png");
  }
  create() {
    this.scene.run("ControlsBar");
    this.input.keyboard?.on("keydown-P", () => {
      this.scene.switch("Pause-Scene");
    });
    const worldWidth = 1920;
    const worldHeight = 1080;
    this.add
      .image(0, 0, "stars")
      .setOrigin(0)
      .setDisplaySize(worldWidth, worldHeight);

    // status bar items
    const scoreTextStyle = {
      fontSize: "50px",
      fontStyle: "bold",
      fontFamily: "Courier New",
    };

    this.add.text(
      +this.game.config.width / 2 - 110,
      -80,
      "SCORE:",
      scoreTextStyle
    );
    const scoreText = this.add.text(
      +this.game.config.width / 2 + 85,
      -80,
      "" + this.score,
      scoreTextStyle
    );

    const playerBeams = this.physics.add.group({ runChildUpdate: true });
    const homingBeams = this.physics.add.group({ runChildUpdate: true });
    const enemyBeams = this.physics.add.group({ runChildUpdate: true });
    const players = this.physics.add.group({ runChildUpdate: true });
    this.enemies = this.physics.add.group({ runChildUpdate: true });

    this.player = new Player(
      this,
      this.playerHealth,
      worldWidth / 2,
      worldHeight / 2,
      worldWidth,
      worldHeight,
      players,
      playerBeams,
      homingBeams,
      this.enemies
    );

    //status-bar camera
    this.cameras
      .add(0, 0, +this.game.config.width, 100)
      .setScroll(0, -100)
      .setBackgroundColor("#262626");

    this.cameras.main
      .setViewport(
        0,
        100,
        +this.game.config.width,
        +this.game.config.height - 200
      )
      .setBounds(0, 0, worldWidth, worldHeight)
      .startFollow(this.player);

    for (let i = 0; i < this.level * 2; i++) {
      new Enemy(
        this,
        worldWidth / 2,
        worldHeight / 2,
        this.player,
        worldWidth,
        worldHeight,
        this.enemies,
        enemyBeams,
        scoreText
      );
    }
    this.physics.add.overlap(this.enemies, homingBeams, (enemy, homingBeam) => {
      homingBeam.destroy();
      (enemy as Enemy).reduceHealth(2);
    });

    this.physics.add.overlap(this.enemies, playerBeams, (enemy, playerBeam) => {
      playerBeam.destroy();
      (enemy as Enemy).reduceHealth(1);
    });

    this.physics.add.overlap(players, enemyBeams, (player, enemyBeam) => {
      enemyBeam.destroy();
      (player as Player).reduceHealth(1);
    });

    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(players, this.enemies);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (
        pointer.leftButtonDown() &&
        !this.player!.cooldown.teleport &&
        pointer.worldY >= 0 &&
        pointer.worldY <= worldHeight
      ) {
        this.player?.teleport({ x: pointer.worldX, y: pointer.worldY });
      }
    });
  }

  update(time: number, delta: number) {
    if (this.enemies!.getLength() === 0) {
      this.scene.restart({
        score: this.score,
        level: this.level + 1,
        playerHealth: this.player!.health,
      });
    }
  }
}
