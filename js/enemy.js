// enemy.js - 敵キャラクタークラス
import { Entity } from './entity.js';
import { CONFIG } from './config.js';

export class Enemy extends Entity {
    constructor(x, y, difficulty = 1) {
        super(x, y, 20 * difficulty, CONFIG.COLORS.ENEMY, CONFIG.ENEMY_BASE_SPEED * (1 + difficulty * 0.1));
        this.hp = 50 * difficulty;
        this.damage = 10 * difficulty;
        this.xpValue = CONFIG.XP_VALUE * difficulty;
        this.difficulty = difficulty;
    }
    
    update(deltaTime, player) {
        // プレイヤーに向かって移動
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
            this.angle = Math.atan2(dy, dx);
        }
        
        super.update(deltaTime);
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        return this.hp <= 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 発光エフェクト
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        // 本体（角のある形状）
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#ff9a9e');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#c0392b');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // 多角形を描画（敵らしく）
        const sides = 6;
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const radius = i % 2 === 0 ? this.size : this.size * 0.7;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        
        // 邪悪な目
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffff00';
        ctx.beginPath();
        ctx.arc(-6, -4, 4, 0, Math.PI * 2);
        ctx.arc(6, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 牙
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-8, 8);
        ctx.lineTo(-4, 14);
        ctx.lineTo(0, 8);
        ctx.moveTo(0, 8);
        ctx.lineTo(4, 14);
        ctx.lineTo(8, 8);
        ctx.fill();
        
        ctx.restore();
    }
}
