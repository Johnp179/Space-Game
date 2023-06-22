export default class HomingBeam extends Phaser.Physics.Arcade.Sprite {
  velocity = 400;
  enemy: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    rotation: number,
    enemy: Phaser.Physics.Arcade.Sprite,
    group: Phaser.Physics.Arcade.Group
  ) {
    super(scene, x, y, "player-beam");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    group.add(this);
    this.setScale(1.5);
    this.rotation = rotation;
    this.enemy = enemy;
  }
  update() {
    const targetAngle = Phaser.Math.Angle.BetweenPoints(
      this.getCenter(),
      this.enemy.getCenter()
    );
    this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetAngle, 0.1);
    this.setVelocity(
      this.velocity * Math.cos(this.rotation),
      this.velocity * Math.sin(this.rotation)
    );
  }
}
