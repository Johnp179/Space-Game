import Button from "../components/Button";

export default class ControlsBar extends Phaser.Scene {
  pauseButton?: Phaser.GameObjects.DOMElement;
  fullScreenButton?: Phaser.GameObjects.DOMElement;

  constructor() {
    super("ControlsBar");
  }
  create() {
    const height = 100;
    this.pauseButton = new Button(
      this,
      +this.game.config.width / 2 - 350,
      height / 2,
      "pause",
      "menu-button",
      "pointerdown",
      () => {
        if (this.scene.isPaused("MainScene")) {
          this.scene.sleep("PauseScene");
          return this.scene.resume("MainScene");
        }
        this.scene.pause("MainScene");
        this.scene.run("PauseScene");
      }
    );

    new Button(
      this,
      +this.game.config.width / 2 + 350,
      height / 2,
      "controls  ",
      "menu-button",
      "pointerdown",
      () => {
        this.scene.start("ControlsScene", { from: "MainScene" });
        if (!this.scene.isPaused("MainScene")) {
          return this.scene.sleep("MainScene");
        }
        this.scene.sleep("PauseScene");
        this.scene.resume("MainScene");
        this.scene.sleep("MainScene");
      }
    );

    this.fullScreenButton = new Button(
      this,
      +this.game.config.width / 2,
      height / 2,
      "fullscreen",
      "menu-button",
      "pointerdown",
      () => {
        if (this.scale.isFullscreen) {
          window.setFullScreen(false);
          return this.scale.stopFullscreen();
        }
        window.setFullScreen(true);
        this.scale.startFullscreen();
      }
    );

    this.cameras.main
      .setViewport(
        0,
        +this.game.config.height - height,
        +this.game.config.width,
        height
      )
      .setBackgroundColor("#262626");
  }

  update(time: number, delta: number): void {
    if (this.scene.isPaused("MainScene")) {
      this.pauseButton!.setText("Resume");
    } else {
      this.pauseButton!.setText("Pause");
    }

    if (this.scale.isFullscreen) {
      this.fullScreenButton!.setText("normal");
    } else {
      this.fullScreenButton!.setText("fullscreen");
    }

    if (this.scale.isFullscreen) {
      window.setFullScreen(true);
    } else {
      window.setFullScreen(false);
    }
  }
}
