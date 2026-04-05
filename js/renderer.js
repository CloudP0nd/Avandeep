// renderer.js - 描画処理モジュール
import { CONFIG } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        CONFIG.CANVAS_WIDTH = this.canvas.width;
        CONFIG.CANVAS_HEIGHT = this.canvas.height;
    }
    
    clear() {
        // グラデーション背景
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            0,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width
        );
        gradient.addColorStop(0, '#16213e');
        gradient.addColorStop(1, '#0f0f23');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // グリッドパターン
        this.ctx.strokeStyle = 'rgba(78, 205, 196, 0.1)';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawEntity(entity) {
        entity.draw(this.ctx);
    }
    
    drawEntities(entities) {
        entities.forEach(entity => entity.draw(this.ctx));
    }
    
    drawUI(player) {
        // HP バー
        const hpPercent = player.hp / player.maxHp;
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(10, 60, 200, 20);
        
        const hpGradient = this.ctx.createLinearGradient(10, 0, 210, 0);
        hpGradient.addColorStop(0, '#e74c3c');
        hpGradient.addColorStop(0.5, '#f39c12');
        hpGradient.addColorStop(1, '#27ae60');
        
        this.ctx.fillStyle = hpGradient;
        this.ctx.fillRect(10, 60, 200 * hpPercent, 20);
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 60, 200, 20);
        
        // XP バー
        const xpPercent = player.xp / player.nextLevelXp;
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(10, 90, 200, 10);
        
        this.ctx.fillStyle = '#95e1d3';
        this.ctx.fillRect(10, 90, 200 * xpPercent, 10);
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(10, 90, 200, 10);
    }
}
