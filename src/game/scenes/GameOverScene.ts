export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }
  create() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "100px",
      fontStyle: "bold",
      fontFamily: "Courier New",
    };
    this.cameras.main.setBackgroundColor("rgb(0,0,0,0.5)");
    this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        "GAME OVER",
        textStyle
      )
      .setOrigin(0.5, 0.5);
  }
}
