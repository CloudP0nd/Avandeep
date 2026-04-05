// bullet.ts - 弾丸クラス
import Phaser from 'phaser';
import { CONFIG } from './config.js';

export class Bullet extends Phaser.GameObjects.Container {
    private vx: number;
    private vy: number;
    private damage: number;
    public size: number;

    constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, damage: number) {
        super(scene, x, y);
        
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.size = 8;

        // 弾丸のグラフィック描画
        const graphics = scene.add.graphics();
        graphics.fillStyle(CONFIG.COLORS.BULLET, 1);
        graphics.fillCircle(0, 0, this.size);
        this.add(graphics);

        // 発光エフェクト
        graphics.postFX?.addGlow(CONFIG.COLORS.BULLET, 4, 25, true, 0.2, 16);

        scene.add.existing(this);
    }

    update(deltaTime: number): void {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }

    isOffScreen(): boolean {
        return (
            this.x < -50 ||
            this.x > this.scene.scale.width + 50 ||
            this.y < -50 ||
            this.y > this.scene.scale.height + 50
        );
    }

    getDamage(): number { return this.damage; }
}
