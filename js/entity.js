// entity.js - 基本エンティティクラス
export class Entity {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
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
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 内側の輝き
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
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
    
    collidesWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return !(a.right < b.left || 
                 a.left > b.right || 
                 a.bottom < b.top || 
                 a.top > b.bottom);
    }
}
