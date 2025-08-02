import Button from "../components/Button";

export default class ControlsScene extends Phaser.Scene {
  sceneToResume?: string;
  mainScenePaused?: boolean;

  constructor() {
    super("ControlsScene");
  }

  init(data: { from: "OpeningScene" | "MainScene"; paused: boolean }) {
    this.mainScenePaused = data.paused;
    this.sceneToResume = data.from;
  }

  preload() {
    this.load.image("nebula2", "/images/Stars_nebulae/Nebula2.png");
  }

  create() {
    this.add
      .image(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        "nebula2"
      )
      .setDisplaySize(+this.game.config.width, +this.game.config.height);

    const offsetX = 112;
    const textStyle = {
      fontSize: "30px",
      fontStyle: "bold",
      wordWrap: { width: 800 },
      fontFamily: "Courier New",
    };
    this.add.text(
      offsetX,
      20,
      "Shift + left click on screen: Teleport to location, 5sec cooldown.",
      textStyle
    );
    this.add.text(
      offsetX,
      120,
      "Right click on enemy: Fire homing-beam, 5sec cooldown.",
      textStyle
    );
    this.add.text(offsetX, 230, "Space: Fire beam.", textStyle);
    this.add.text(offsetX, 310, "W: Move forward.", textStyle);
    this.add.text(offsetX, 390, "S: Move backward.", textStyle);
    this.add.text(offsetX, 470, "A: Turn left.", textStyle);
    this.add.text(offsetX, 550, "D: Turn right.", textStyle);
    this.add.text(offsetX, 630, "P: Pause game.", textStyle);
    this.add.text(offsetX, 710, "R: Resume game.", textStyle);

    new Button(
      this,
      +this.game.config.width / 2,
      +this.game.config.height - 100,
      "BACK",
      "menu-button",
      "pointerdown",
      () => {
        if (this.sceneToResume === "OpeningScene")
          return this.scene.start("OpeningScene");

        // the main scene is running
        this.scene.start("ControlsBar");
        if (!this.mainScenePaused) {
          return this.scene.run("MainScene");
        }

        this.scene.run("MainScene");
        this.scene.pause("MainScene");
        this.scene.run("PauseScene");
      }
    );
  }
}
