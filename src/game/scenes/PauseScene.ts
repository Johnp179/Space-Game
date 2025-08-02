export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }
  create() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "100px",
      fontStyle: "bold",
      fontFamily: "Courier New",
    };
    this.input.keyboard?.on("keydown-R", () => {
      console.log("you hit the r key");
      this.scene.sleep("PauseScene");
      this.scene.resume("MainScene");
    });
    this.cameras.main.setBackgroundColor({ r: 0, g: 0, b: 0, a: 140 });

    this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        "GAME PAUSED",
        textStyle
      )
      .setOrigin(0.5);
  }
}
