// xpGem.ts - XP ジェムクラス
import Phaser from 'phaser';
import { CONFIG } from './config.js';

export class XpGem extends Phaser.GameObjects.Container {
    private value: number;
    public size: number;
    private rotationSpeed: number;
    private floatOffset: number;

    constructor(scene: Phaser.Scene, x: number, y: number, value: number) {
        super(scene, x, y);
        
        this.value = value;
        this.size = 10;
        this.rotationSpeed = Math.random() * 0.05 + 0.02;
        this.floatOffset = Math.random() * Math.PI * 2;

        // ジェムのグラフィック描画
        const graphics = scene.add.graphics();
        graphics.fillStyle(CONFIG.COLORS.XP, 1);
        
        // ダイヤモンド形状
        graphics.beginPath();
        graphics.moveTo(0, -this.size);
        graphics.lineTo(this.size * 0.7, 0);
        graphics.lineTo(0, this.size);
        graphics.lineTo(-this.size * 0.7, 0);
        graphics.closePath();
        graphics.fillPath();

        // キラキラ効果
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(-3, -3, 2);

        this.add(graphics);

        // 発光エフェクト
        graphics.postFX?.addGlow(CONFIG.COLORS.XP, 4, 20, true, 0.2, 16);

        scene.add.existing(this);
    }

    update(deltaTime: number, player: Phaser.GameObjects.Container): void {
        this.rotation += this.rotationSpeed;

        // プレイヤーに近づくと吸い寄せられる
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const speed = 8;
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        }
    }

    getValue(): number { return this.value; }
}
