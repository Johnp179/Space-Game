export default class Button extends Phaser.GameObjects.DOMElement {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    className: string,
    event: "pointerdown" | "pointerup",
    callback: () => any
  ) {
    super(scene, x, y, "div", null, text);
    this.scene.add.existing(this);
    this.setClassName(className);
    this.addListener(event);
    this.on(event, callback);
  }
}
