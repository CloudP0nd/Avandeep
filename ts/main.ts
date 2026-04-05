// main.ts - エントリーポイント
import Phaser from 'phaser';
import { MainScene } from './mainScene.js';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'gameCanvas',
    backgroundColor: '#1a1a2e',
    scene: [MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
