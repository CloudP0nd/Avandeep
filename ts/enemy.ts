// enemy.ts - 敵キャラクタークラス
import Phaser from 'phaser';
import { Entity } from './entity.js';
import { CONFIG } from './config.js';

export class Enemy extends Entity {
    private hp: number;
    private damage: number;
    private xpValue: number;
    private difficulty: number;

    constructor(scene: Phaser.Scene, x: number, y: number, difficulty: number = 1) {
        super(scene, x, y, 20 * difficulty, CONFIG.COLORS.ENEMY, CONFIG.ENEMY_BASE_SPEED * (1 + difficulty * 0.1));
        
        this.hp = 50 * difficulty;
        this.damage = 10 * difficulty;
        this.xpValue = CONFIG.XP_VALUE * difficulty;
        this.difficulty = difficulty;
    }

    update(deltaTime: number, player: Entity): void {
        // プレイヤーに向かって移動
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        }

        super.update(deltaTime);
    }

    takeDamage(amount: number): boolean {
        this.hp -= amount;
        return this.hp <= 0;
    }

    getXpValue(): number { return this.xpValue; }
    getDamage(): number { return this.damage; }
}
