// input.js - 入力処理モジュール
export class InputHandler {
    constructor() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    getMovementDirection() {
        let dx = 0;
        let dy = 0;
        
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy -= 1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy += 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx -= 1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx += 1;
        
        // 正規化
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;
        }
        
        return { x: dx, y: dy };
    }
    
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }
}
