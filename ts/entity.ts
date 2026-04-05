// entity.ts - 基本エンティティクラス
import Phaser from 'phaser';

export abstract class Entity extends Phaser.GameObjects.Container {
    protected speed: number;
    protected vx: number = 0;
    protected vy: number = 0;
    public size: number;

    constructor(scene: Phaser.Scene, x: number, y: number, size: number, color: number, speed: number) {
        super(scene, x, y);
        this.size = size;
        this.speed = speed;
        
        scene.add.existing(this);
    }

    update(deltaTime: number, ...args: any[]): void {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }

    getBounds(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
        );
    }

    collidesWith(other: Entity): boolean {
        const a = this.getBounds();
        const b = other.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(a, b);
    }
}
