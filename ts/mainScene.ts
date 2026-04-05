// mainScene.ts - メインゲームシーン
import Phaser from 'phaser';
import { CONFIG } from './config.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Bullet } from './bullet.js';
import { XpGem } from './xpGem.js';
import { Particle, createExplosion } from './particle.js';

export class MainScene extends Phaser.Scene {
    private player!: Player;
    private enemies: Enemy[] = [];
    private bullets: Bullet[] = [];
    private xpGems: XpGem[] = [];
    private particles: Particle[] = [];
    
    private score: number = 0;
    private isGameOver: boolean = false;
    private enemySpawnTimer: number = 0;
    
    // UI テキスト
    private scoreText!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private hpText!: Phaser.GameObjects.Text;
    private xpText!: Phaser.GameObjects.Text;
    private nextLevelText!: Phaser.GameObjects.Text;
    private gameOverText!: Phaser.GameObjects.Text;
    private restartBtn!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // 背景描画
        this.createBackground();

        // プレイヤー作成
        this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);

        // UI 作成
        this.createUI();

        // ゲームオーバー時のリスタート処理
        this.restartBtn.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.restart());

        this.init();
    }

    private createBackground(): void {
        const graphics = this.add.graphics();
        
        // グリッドパターン
        graphics.lineStyle(1, 0x4ecdc4, 0.1);
        const gridSize = 50;
        
        for (let x = 0; x < this.scale.width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.scale.height);
        }
        
        for (let y = 0; y < this.scale.height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.scale.width, y);
        }
        
        graphics.strokePath();
    }

    private createUI(): void {
        const style = {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        this.scoreText = this.add.text(10, 10, 'Score: 0', style);
        this.levelText = this.add.text(10, 35, 'Level: 1', style);
        this.hpText = this.add.text(10, 60, 'HP: 100/100', style);
        this.xpText = this.add.text(10, 85, 'XP: 0/', style);
        this.nextLevelText = this.add.text(10, 85, '', style);

        // ゲームオーバーテキスト
        this.gameOverText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 50,
            'GAME OVER',
            {
                fontSize: '48px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setVisible(false);

        this.restartBtn = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 20,
            'Restart',
            {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#ff6b6b',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setVisible(false);
    }

    init(): void {
        this.enemies = [];
        this.bullets = [];
        this.xpGems = [];
        this.particles = [];
        this.score = 0;
        this.isGameOver = false;
        this.enemySpawnTimer = 0;
        
        this.gameOverText.setVisible(false);
        this.restartBtn.setVisible(false);
    }

    restart(): void {
        this.scene.restart();
    }

    spawnEnemy(): void {
        // 画面外からスポーン
        let x: number = 0;
        let y: number = 0;
        const edge = Math.floor(Math.random() * 4);

        switch(edge) {
            case 0: // 上
                x = Math.random() * this.scale.width;
                y = -30;
                break;
            case 1: // 右
                x = this.scale.width + 30;
                y = Math.random() * this.scale.height;
                break;
            case 2: // 下
                x = Math.random() * this.scale.width;
                y = this.scale.height + 30;
                break;
            case 3: // 左
                x = -30;
                y = Math.random() * this.scale.height;
                break;
        }

        const difficulty = 1 + Math.floor(this.score / 500) * 0.2;
        const enemy = new Enemy(this, x, y, difficulty);
        this.enemies.push(enemy);
    }

    update(time: number, deltaTime: number): void {
        if (this.isGameOver) return;

        const deltaSeconds = deltaTime / 1000;

        // プレイヤー更新
        this.player.update(deltaSeconds, this.enemies);

        // 弾丸発射
        const bulletData = this.player.shoot(this.enemies);
        if (bulletData) {
            const bullet = new Bullet(
                this,
                bulletData.x,
                bulletData.y,
                bulletData.vx,
                bulletData.vy,
                bulletData.damage
            );
            this.bullets.push(bullet);
        }

        // 敵のスポーン
        this.enemySpawnTimer += deltaTime;
        const spawnRate = Math.max(200, CONFIG.ENEMY_SPAWN_RATE - this.score * 2);

        if (this.enemySpawnTimer >= spawnRate) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        // 敵更新
        this.enemies.forEach(enemy => enemy.update(deltaSeconds, this.player));

        // 弾丸更新
        this.bullets.forEach(bullet => bullet.update(deltaSeconds));
        this.bullets = this.bullets.filter(bullet => !bullet.isOffScreen());

        // XP ジェム更新
        this.xpGems.forEach(gem => gem.update(deltaSeconds, this.player));

        // パーティクル更新
        this.particles.forEach(particle => particle.update(deltaSeconds));
        this.particles = this.particles.filter(particle => !particle.isDead());

        // 衝突判定
        this.checkCollisions();

        // UI 更新
        this.updateUI();
    }

    checkCollisions(): void {
        // 弾丸 vs 敵
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const bullet = this.bullets[i];
                const enemy = this.enemies[j];
                
                if (bullet && enemy) {
                    const dx = bullet.x - enemy.x;
                    const dy = bullet.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < enemy.size + bullet.size) {
                        if (enemy.takeDamage(bullet.getDamage())) {
                            // 敵撃破
                            const xpGem = new XpGem(this, enemy.x, enemy.y, enemy.getXpValue());
                            this.xpGems.push(xpGem);
                            
                            const particles = createExplosion(this, enemy.x, enemy.y, CONFIG.COLORS.ENEMY, 15);
                            this.particles.push(...particles);
                            
                            this.enemies.splice(j, 1);
                            this.score += 10;
                        }
                        
                        this.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }

        // 敵 vs プレイヤー
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy) continue;
            
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < enemy.size + this.player.size) {
                if (this.player.takeDamage(enemy.getDamage() * 0.1)) {
                    this.gameOver();
                }

                const particles = createExplosion(this, enemy.x, enemy.y, 0xff0000, 5);
                this.particles.push(...particles);
                this.enemies.splice(i, 1);
            }
        }

        // XP ジェム vs プレイヤー
        for (let i = this.xpGems.length - 1; i >= 0; i--) {
            const gem = this.xpGems[i];
            if (!gem) continue;
            
            const dx = gem.x - this.player.x;
            const dy = gem.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < gem.size + this.player.size) {
                this.player.gainXp(gem.getValue());
                this.xpGems.splice(i, 1);
            }
        }
    }

    updateUI(): void {
        this.scoreText.setText(`Score: ${this.score}`);
        this.levelText.setText(`Level: ${this.player.getLevel()}`);
        this.hpText.setText(`HP: ${Math.floor(this.player.getHp())}/${this.player.getMaxHp()}`);
        this.xpText.setText(`XP: ${this.player.getXp()}/${this.player.getNextLevelXp()}`);
    }

    gameOver(): void {
        this.isGameOver = true;
        this.gameOverText.setVisible(true);
        this.restartBtn.setVisible(true);
    }
}
