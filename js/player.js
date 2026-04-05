// player.js - プレイヤークラス
import { Entity } from './entity.js';
import { CONFIG } from './config.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, CONFIG.PLAYER_SIZE, CONFIG.COLORS.PLAYER, CONFIG.PLAYER_SPEED);
        this.hp = 100;
        this.maxHp = 100;
        this.xp = 0;
        this.level = 1;
        this.nextLevelXp = CONFIG.LEVEL_XP_BASE;
        this.lastFireTime = 0;
        this.damage = 25;
        this.fireRate = CONFIG.FIRE_RATE;
    }
    
    update(deltaTime, input, enemies) {
        const movement = input.getMovementDirection();
        this.vx = movement.x * this.speed;
        this.vy = movement.y * this.speed;
        
        super.update(deltaTime);
        
        // 画面内に制限
        this.x = Math.max(this.size, Math.min(CONFIG.CANVAS_WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CONFIG.CANVAS_HEIGHT - this.size, this.y));
        
        // 最も近い敵に向かって自動射撃
        const now = Date.now();
        if (now - this.lastFireTime >= this.fireRate && enemies.length > 0) {
            this.shoot(enemies);
            this.lastFireTime = now;
        }
    }
    
    shoot(enemies) {
        // 最も近い敵を見つける
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        for (const enemy of enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        if (nearestEnemy) {
            const dx = nearestEnemy.x - this.x;
            const dy = nearestEnemy.y - this.y;
            const angle = Math.atan2(dy, dx);
            
            return {
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * CONFIG.BULLET_SPEED,
                vy: Math.sin(angle) * CONFIG.BULLET_SPEED,
                damage: this.damage
            };
        }
        
        return null;
    }
    
    gainXp(amount) {
        this.xp += amount;
        
        if (this.xp >= this.nextLevelXp) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.xp -= this.nextLevelXp;
        this.level++;
        this.nextLevelXp = Math.floor(this.nextLevelXp * CONFIG.LEVEL_XP_MULTIPLIER);
        
        // ステータスアップ
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.damage += 5;
        this.fireRate = Math.max(100, this.fireRate - 50);
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        return this.hp <= 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 発光エフェクト
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.color;
        
        // 本体
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, '#2a9d8f');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 目の描写
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-8, -5, 6, 0, Math.PI * 2);
        ctx.arc(8, -5, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}
