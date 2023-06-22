export default class ControlsBar extends Phaser.Scene {
  pauseButton?: Phaser.GameObjects.DOMElement;
  constructor() {
    super("ControlsBar");
  }
  create() {
    const height = 100;
    this.add
      .dom(
        +this.game.config.width / 2 + 200,
        height / 2,
        "div",
        null,
        "controls"
      )
      .setClassName("menu-button")
      .addListener("pointerdown")
      .on("pointerdown", () => {
        this.scene.switch("ControlsScene");
        this.scene.sleep("MainScene");
      });

    this.pauseButton = this.add
      .dom(+this.game.config.width / 2 - 200, height / 2, "div", null, "pause")
      .setClassName("menu-button")
      .addListener("pointerdown")
      .on("pointerdown", () => {
        if (this.scene.isPaused("MainScene")) {
          return this.scene.resume("MainScene");
        }
        this.scene.pause("MainScene");
      });

    this.cameras.main
      .setViewport(
        0,
        +this.game.config.height - height,
        +this.game.config.width,
        height
      )
      .setBackgroundColor("#262626");
    this.scene.run("Main-Scene");
  }

  update(time: number, delta: number): void {
    if (this.scene.isPaused("MainScene")) {
      this.pauseButton!.setText("resume");
    } else {
      this.pauseButton!.setText("pause");
    }
  }
}
