export default class Beam extends Phaser.Physics.Arcade.Sprite {
  velocity = 300;
  worldWidth: number;
  worldHeight: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    rotation: number,
    worldWidth: number,
    worldHeight: number,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(scene, x, y, texture);
    group.add(this);
    this.rotation = rotation;
    this.worldHeight = worldHeight;
    this.worldWidth = worldWidth;
    this.setScale(1.5);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setVelocity(
      this.velocity * Math.cos(this.rotation),
      this.velocity * Math.sin(this.rotation)
    );
  }
  update() {
    if (
      this.x > this.worldWidth ||
      this.x < 0 ||
      this.y > this.worldHeight ||
      this.y < 0
    ) {
      this.destroy();
    }
  }
}
