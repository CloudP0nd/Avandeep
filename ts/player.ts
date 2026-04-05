// player.ts - プレイヤークラス
import Phaser from 'phaser';
import { Entity } from './entity.js';
import { CONFIG } from './config.js';

export class Player extends Entity {
    private hp: number;
    private maxHp: number;
    private xp: number;
    private level: number;
    private nextLevelXp: number;
    private lastFireTime: number;
    private damage: number;
    private fireRate: number;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, CONFIG.PLAYER_SIZE, CONFIG.COLORS.PLAYER, CONFIG.PLAYER_SPEED);
        
        this.hp = 100;
        this.maxHp = 100;
        this.xp = 0;
        this.level = 1;
        this.nextLevelXp = CONFIG.LEVEL_XP_BASE;
        this.lastFireTime = 0;
        this.damage = 25;
        this.fireRate = CONFIG.FIRE_RATE;

        // キーボード入力設定
        const keyboard = scene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
        this.cursors = keyboard.createCursorKeys();
        this.keyW = keyboard.addKey('W');
        this.keyS = keyboard.addKey('S');
        this.keyA = keyboard.addKey('A');
        this.keyD = keyboard.addKey('D');
    }

    update(deltaTime: number, enemies: Entity[]): void {
        let dx = 0;
        let dy = 0;

        if (this.cursors.up?.isDown || this.keyW?.isDown) dy -= 1;
        if (this.cursors.down?.isDown || this.keyS?.isDown) dy += 1;
        if (this.cursors.left?.isDown || this.keyA?.isDown) dx -= 1;
        if (this.cursors.right?.isDown || this.keyD?.isDown) dx += 1;

        // 正規化
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;
        }

        this.vx = dx * this.speed;
        this.vy = dy * this.speed;

        super.update(deltaTime);

        // 画面内に制限
        this.x = Phaser.Math.Clamp(this.x, this.size, this.scene.scale.width - this.size);
        this.y = Phaser.Math.Clamp(this.y, this.size, this.scene.scale.height - this.size);

        // 最も近い敵に向かって自動射撃
        const now = Date.now();
        if (now - this.lastFireTime >= this.fireRate && enemies.length > 0) {
            this.lastFireTime = now;
        }
    }

    shoot(enemies: Entity[]): { x: number; y: number; vx: number; vy: number; damage: number } | null {
        let nearestEnemy: Entity | null = null;
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

    gainXp(amount: number): void {
        this.xp += amount;

        if (this.xp >= this.nextLevelXp) {
            this.levelUp();
        }
    }

    levelUp(): void {
        this.xp -= this.nextLevelXp;
        this.level++;
        this.nextLevelXp = Math.floor(this.nextLevelXp * CONFIG.LEVEL_XP_MULTIPLIER);

        // ステータスアップ
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.damage += 5;
        this.fireRate = Math.max(100, this.fireRate - 50);
    }

    takeDamage(amount: number): boolean {
        this.hp -= amount;
        return this.hp <= 0;
    }

    getHp(): number { return this.hp; }
    getMaxHp(): number { return this.maxHp; }
    getXp(): number { return this.xp; }
    getLevel(): number { return this.level; }
    getNextLevelXp(): number { return this.nextLevelXp; }
    getDamage(): number { return this.damage; }
}
