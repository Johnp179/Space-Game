import Button from "../components/Button";
export default class OpeningScene extends Phaser.Scene {
  constructor() {
    super("OpeningScene");
  }
  preload() {
    this.load.image("stars", "/images/Stars_nebulae/stars.png");
  }

  create() {
    this.add
      .image(+this.game.config.width / 2, +this.game.config.height / 2, "stars")
      .setDisplaySize(+this.game.config.width, +this.game.config.height);

    new Button(
      this,
      +this.game.config.width / 2,
      +this.game.config.height / 2 - 40,
      "start",
      "menu-button",
      "pointerdown",
      () => this.scene.start("MainScene")
    );

    new Button(
      this,
      +this.game.config.width / 2,
      +this.game.config.height / 2 + 60,
      "controls",
      "menu-button",
      "pointerdown",
      () => this.scene.start("ControlsScene", { from: "OpeningScene" })
    );
  }
}
