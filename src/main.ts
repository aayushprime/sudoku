import './style.css';
import { Application, Container, Ticker } from 'pixi.js';
import { SceneManager } from './pixi-game-kit/scene/SceneManager';
import { GameScene } from './scenes/GameScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameEndScene } from './scenes/GameEndScene';
import { AssetManager } from './pixi-game-kit/assets/AssetManager';

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 960; // 4:3 aspect ratio

async function main() {
    const app = new Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000, // Black background for letterboxing
    });
    document.body.appendChild(app.canvas as unknown as Node);

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    await AssetManager.initialize();

    const sceneManager = new SceneManager(app, gameContainer);

    const handlePlay = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        sceneManager.goTo('game', { difficulty });
    };

    sceneManager.add('main-menu', new MainMenuScene(app, handlePlay));
    sceneManager.add('game', new GameScene(app, sceneManager));

    const handleGoToMenu = () => {
        sceneManager.goTo('main-menu');
    };
    sceneManager.add('game-end', new GameEndScene(app, handleGoToMenu));

    sceneManager.goTo('main-menu');

    // Game loop
    Ticker.shared.add((ticker) => {
        sceneManager.update(ticker.deltaTime);
    });

    // Letterbox scaling
    function resize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        app.renderer.resize(screenWidth, screenHeight);

        const scale = Math.min(screenWidth / GAME_WIDTH, screenHeight / GAME_HEIGHT);

        gameContainer.scale.set(scale);
        gameContainer.x = (screenWidth - GAME_WIDTH * scale) / 2;
        gameContainer.y = (screenHeight - GAME_HEIGHT * scale) / 2;

        sceneManager.resize(GAME_WIDTH, GAME_HEIGHT);
    }

    window.addEventListener('resize', resize);
    resize();
}

main();