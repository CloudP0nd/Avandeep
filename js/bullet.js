// bullet.js - 弾丸クラス
import { CONFIG } from './config.js';

export class Bullet {
    constructor(x, y, vx, vy, damage) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.size = 8;
        this.color = CONFIG.COLORS.BULLET;
        this.angle = Math.atan2(vy, vx);
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 発光エフェクト
        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color;
        
        // 弾丸本体（流れ星のような形状）
        const gradient = ctx.createLinearGradient(-15, 0, 15, 0);
        gradient.addColorStop(0, 'rgba(255, 230, 109, 0)');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#ffffff');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // コア
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(5, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    isOffScreen() {
        return (
            this.x < -50 ||
            this.x > CONFIG.CANVAS_WIDTH + 50 ||
            this.y < -50 ||
            this.y > CONFIG.CANVAS_HEIGHT + 50
        );
    }
}
