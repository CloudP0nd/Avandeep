// particle.js - パーティクルエフェクトクラス
export class Particle {
    constructor(x, y, color, vx, vy, life = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 4 + 2;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= deltaTime;
        this.vx *= 0.98; // フリクション
        this.vy *= 0.98;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

export function createExplosion(x, y, color, count = 10) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = Math.random() * 3 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        particles.push(new Particle(x, y, color, vx, vy, 0.5 + Math.random() * 0.3));
    }
    
    return particles;
}
