// main.js - メインゲームループ
import { CONFIG } from './config.js';
import { InputHandler } from './input.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Bullet } from './bullet.js';
import { XpGem } from './xpGem.js';
import { createExplosion } from './particle.js';
import { Renderer } from './renderer.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.input = new InputHandler();
        
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.hpElement = document.getElementById('hp');
        this.xpElement = document.getElementById('xp');
        this.nextLevelElement = document.getElementById('nextLevel');
        this.gameOverElement = document.getElementById('gameOver');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.restartBtn.addEventListener('click', () => this.restart());
        
        this.init();
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.difficulty = 1;
        
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }
    
    init() {
        this.player = new Player(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
        this.enemies = [];
        this.bullets = [];
        this.xpGems = [];
        this.particles = [];
        this.score = 0;
        this.isGameOver = false;
        this.gameOverElement.style.display = 'none';
    }
    
    restart() {
        this.init();
        this.lastTime = performance.now();
    }
    
    spawnEnemy() {
        // 画面外からスポーン
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        
        switch(edge) {
            case 0: // 上
                x = Math.random() * CONFIG.CANVAS_WIDTH;
                y = -30;
                break;
            case 1: // 右
                x = CONFIG.CANVAS_WIDTH + 30;
                y = Math.random() * CONFIG.CANVAS_HEIGHT;
                break;
            case 2: // 下
                x = Math.random() * CONFIG.CANVAS_WIDTH;
                y = CONFIG.CANVAS_HEIGHT + 30;
                break;
            case 3: // 左
                x = -30;
                y = Math.random() * CONFIG.CANVAS_HEIGHT;
                break;
        }
        
        const difficulty = 1 + Math.floor(this.score / 500) * 0.2;
        this.enemies.push(new Enemy(x, y, difficulty));
    }
    
    update(deltaTime) {
        if (this.isGameOver) return;
        
        // プレイヤー更新
        this.player.update(deltaTime, this.input, this.enemies);
        
        // 弾丸発射
        const bulletData = this.player.shoot(this.enemies);
        if (bulletData) {
            this.bullets.push(new Bullet(
                bulletData.x,
                bulletData.y,
                bulletData.vx,
                bulletData.vy,
                bulletData.damage
            ));
        }
        
        // 敵のスポーン
        this.enemySpawnTimer += deltaTime * 1000;
        const spawnRate = Math.max(200, CONFIG.ENEMY_SPAWN_RATE - this.score * 2);
        
        if (this.enemySpawnTimer >= spawnRate) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // 敵更新
        this.enemies.forEach(enemy => enemy.update(deltaTime, this.player));
        
        // 弾丸更新
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.bullets = this.bullets.filter(bullet => !bullet.isOffScreen());
        
        // XP ジェム更新
        this.xpGems.forEach(gem => gem.update(deltaTime, this.player));
        
        // パーティクル更新
        this.particles.forEach(particle => particle.update(deltaTime));
        this.particles = this.particles.filter(particle => !particle.isDead());
        
        // 衝突判定
        this.checkCollisions();
        
        // UI 更新
        this.updateUI();
    }
    
    checkCollisions() {
        // 弾丸 vs 敵
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.bullets[i] && this.enemies[j] && 
                    this.bullets[i].x > this.enemies[j].x - this.enemies[j].size &&
                    this.bullets[i].x < this.enemies[j].x + this.enemies[j].size &&
                    this.bullets[i].y > this.enemies[j].y - this.enemies[j].size &&
                    this.bullets[i].y < this.enemies[j].y + this.enemies[j].size) {
                    
                    const enemy = this.enemies[j];
                    if (enemy.takeDamage(this.bullets[i].damage)) {
                        // 敵撃破
                        this.xpGems.push(new XpGem(enemy.x, enemy.y, enemy.xpValue));
                        this.particles.push(...createExplosion(enemy.x, enemy.y, enemy.color, 15));
                        this.enemies.splice(j, 1);
                        this.score += 10;
                    }
                    
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // 敵 vs プレイヤー
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < enemy.size + this.player.size) {
                if (this.player.takeDamage(enemy.damage * 0.1)) {
                    this.gameOver();
                }
                
                this.particles.push(...createExplosion(enemy.x, enemy.y, '#ff0000', 5));
                this.enemies.splice(i, 1);
            }
        }
        
        // XP ジェム vs プレイヤー
        for (let i = this.xpGems.length - 1; i >= 0; i--) {
            const gem = this.xpGems[i];
            const dx = gem.x - this.player.x;
            const dy = gem.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < gem.size + this.player.size) {
                this.player.gainXp(gem.value);
                this.xpGems.splice(i, 1);
            }
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.player.level;
        this.hpElement.textContent = Math.floor(this.player.hp);
        this.xpElement.textContent = this.player.xp;
        this.nextLevelElement.textContent = this.player.nextLevelXp;
    }
    
    gameOver() {
        this.isGameOver = true;
        this.gameOverElement.style.display = 'block';
    }
    
    draw() {
        this.renderer.clear();
        this.renderer.drawEntity(this.player);
        this.renderer.drawEntities(this.enemies);
        this.renderer.drawEntities(this.bullets);
        this.renderer.drawEntities(this.xpGems);
        this.renderer.drawEntities(this.particles);
        this.renderer.drawUI(this.player);
    }
    
    loop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame(this.loop);
    }
}

// ゲーム開始
window.addEventListener('load', () => {
    new Game();
});
