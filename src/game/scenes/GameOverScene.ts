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

    this.cameras.main.setBackgroundColor({ r: 0, g: 0, b: 0, a: 140 });

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
