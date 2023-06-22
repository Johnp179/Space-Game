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

    this.add
      .dom(
        +this.game.config.width / 2,
        +this.game.config.height / 2 - 40,
        "div",
        null,
        "start"
      )
      .setClassName("menu-button")
      .addListener("pointerdown")
      .on("pointerdown", () => this.scene.start("MainScene"));

    this.add
      .dom(
        +this.game.config.width / 2,
        +this.game.config.height / 2 + 60,
        "div",
        null,
        "controls"
      )
      .setClassName("menu-button")
      .addListener("pointerdown")
      .on("pointerdown", () =>
        this.scene.start("ControlsScene", { from: "OpeningScene" })
      );
  }
}
