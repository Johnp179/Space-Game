export default class Cooldown {
  image: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
  timer = 5000;
  cooldownTextStyle = {
    fontSize: "40px",
    fontStyle: "bold",
    fontFamily: "Courier New",
  };
  imageX = 0;
  textX = 60;
  y = -140;
  deltaX = 180;
  cooldownRef: { homingBeam: boolean; teleport: boolean };
  cooldownGroup: Cooldown[];
  index: number;
  type: "homing-beam" | "teleport";

  constructor(
    type: "homing-beam" | "teleport",
    scene: Phaser.Scene,
    cooldownRef: { homingBeam: boolean; teleport: boolean },
    cooldownGroup: Cooldown[]
  ) {
    this.cooldownGroup = cooldownGroup;
    this.index = this.cooldownGroup.push(this) - 1;
    this.type = type;
    this.image = scene.add
      .image(
        this.imageX + this.index * this.deltaX,
        this.y,
        this.type === "homing-beam" ? "homing-beam-icon" : "teleport-icon"
      )
      .setOrigin(0, 0)
      .setDisplaySize(50, 50);
    this.text = scene.add.text(
      this.textX + this.index * this.deltaX,
      this.y,
      "5.00",
      this.cooldownTextStyle
    );
    this.cooldownRef = cooldownRef;
  }
  update(deltaT: number) {
    this.timer -= deltaT;
    if (this.timer < 0) {
      this.destroy();
    } else {
      this.text.setText((this.timer / 1000).toFixed(2));
    }
  }
  updateIndexAndPosition(index: number) {
    this.index = index;
    this.image.x = this.imageX + this.index * this.deltaX;
    this.text.x = this.textX + this.index * this.deltaX;
  }
  destroy() {
    this.image.destroy();
    this.text.destroy();
    this.cooldownGroup.splice(this.index, 1);
    this.cooldownGroup.forEach((cooldown, index) => {
      cooldown.updateIndexAndPosition(index);
    });
    if (this.type === "homing-beam") {
      this.cooldownRef.homingBeam = false;
    } else {
      this.cooldownRef.teleport = false;
    }
  }
}
