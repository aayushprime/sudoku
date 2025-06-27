import { Application, Container } from 'pixi.js';
import { Scene } from './Scene';

export class SceneManager {
    private app: Application;
    private gameContainer: Container;
    private scenes: Record<string, Scene> = {};
    private currentScene: Scene | null = null;
    private gameWidth = 0;
    private gameHeight = 0;

    constructor(app: Application, gameContainer: Container) {
        this.app = app;
        this.gameContainer = gameContainer;
    }

    /**
     * Adds a scene to the manager.
     * @param key - A unique key to identify the scene.
     * @param scene - The scene object to add.
     */
    public add(key: string, scene: Scene) {
        this.scenes[key] = scene;
    }

    /**
     * Switches to the specified scene.
     * @param key - The key of the scene to switch to.
     */
    public goTo(key: string, options?: any) {
        if (this.currentScene) {
            this.gameContainer.removeChild(this.currentScene);
        }

        const newScene = this.scenes[key];
        if (newScene) {
            this.currentScene = newScene;
            this.gameContainer.addChild(this.currentScene);
            if (this.currentScene.onEnter) {
                this.currentScene.onEnter(options);
            }
            this.currentScene.resize(this.gameWidth, this.gameHeight);
        } else {
            console.error(`Scene with key '${key}' not found.`);
        }
    }

    /**
     * Updates the current active scene.
     * @param delta - The time elapsed since the last frame.
     */
    public update(delta: number) {
        if (this.currentScene) {
            this.currentScene.update(delta);
        }
    }

    /**
     * Resizes the current active scene.
     */
    public resize(width: number, height: number) {
        this.gameWidth = width;
        this.gameHeight = height;

        if (this.currentScene) {
            this.currentScene.resize(width, height);
        }
    }
} 