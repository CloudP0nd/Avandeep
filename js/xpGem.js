// xpGem.js - XP ジェムクラス
import { CONFIG } from './config.js';

export class XpGem {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.size = 10;
        this.color = CONFIG.COLORS.XP;
        this.angle = 0;
        this.rotationSpeed = Math.random() * 0.05 + 0.02;
        this.floatOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime, player) {
        this.angle += this.rotationSpeed;
        
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
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const floatY = Math.sin(Date.now() * 0.003 + this.floatOffset) * 3;
        ctx.translate(0, floatY);
        
        // 発光エフェクト
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        // ジェムの形状（ダイヤモンド）
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, this.color);
        gradient.addColorStop(1, '#16a085');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.7, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        
        // キラキラ効果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-3, -3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            left: this.x - this.size,
            right: this.x + this.size,
            top: this.y - this.size,
            bottom: this.y + this.size
        };
    }
}
