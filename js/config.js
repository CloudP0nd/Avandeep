// config.js - 設定モジュール
export const CONFIG = {
    CANVAS_WIDTH: typeof window !== 'undefined' ? window.innerWidth : 800,
    CANVAS_HEIGHT: typeof window !== 'undefined' ? window.innerHeight : 600,
    PLAYER_SPEED: 5,
    PLAYER_SIZE: 30,
    ENEMY_BASE_SPEED: 2,
    ENEMY_SPAWN_RATE: 1000, // ms
    BULLET_SPEED: 10,
    FIRE_RATE: 500, // ms
    XP_VALUE: 10,
    LEVEL_XP_BASE: 100,
    LEVEL_XP_MULTIPLIER: 1.5,
    COLORS: {
        PLAYER: '#4ecdc4',
        ENEMY: '#ff6b6b',
        BULLET: '#ffe66d',
        XP: '#95e1d3',
        BACKGROUND: '#1a1a2e'
    }
};
