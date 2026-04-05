// particle.ts - パーティクルエフェクトクラス
import Phaser from 'phaser';

export class Particle extends Phaser.GameObjects.Arc {
    private vx: number;
    private vy: number;
    private life: number;
    private maxLife: number;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number, vx: number, vy: number, life: number = 1) {
        super(scene, x, y, Math.random() * 4 + 2, color);
        
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;

        scene.add.existing(this);
    }

    update(deltaTime: number): void {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= deltaTime;
        this.vx *= 0.98; // フリクション
        this.vy *= 0.98;

        // アルファ値をライフに基づいて更新
        this.alpha = this.life / this.maxLife;
    }

    isDead(): boolean {
        return this.life <= 0;
    }
}

export function createExplosion(scene: Phaser.Scene, x: number, y: number, color: number, count: number = 10): Particle[] {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = Math.random() * 3 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push(new Particle(scene, x, y, color, vx, vy, 0.5 + Math.random() * 0.3));
    }

    return particles;
}
