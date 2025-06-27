import { Container, Application } from 'pixi.js';

/**
 * An abstract base class for all scenes in the game.
 * It provides a structured way to handle scene-specific logic,
 * such as updates, resizing, and containing game objects.
 */
export abstract class Scene extends Container {
    protected app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    /**
     * Called when the scene is entered.
     * @param options - Optional data to pass during scene transition.
     */
    public onEnter?(options?: any): void;

    /**
     * Called every frame by the main game loop.
     * @param delta - The time elapsed since the last frame.
     */
    public abstract update(delta: number): void;

    /**
     * Called when the application window is resized.
     * @param screenWidth - The new width of the screen.
     * @param screenHeight - The new height of the screen.
     */
    public abstract resize(screenWidth: number, screenHeight: number): void;
} 