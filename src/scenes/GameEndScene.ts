import { Application, Rectangle } from 'pixi.js';
import { Scene } from '../pixi-game-kit/scene/Scene';
import { Button } from '../pixi-game-kit/ui/Button';
import { Label } from '../pixi-game-kit/ui/Label';
import { UIComponent, Anchor } from '../pixi-game-kit/ui/UIComponent';
import { LayoutSystem } from '../pixi-game-kit/layout/LayoutSystem';

export class GameEndScene extends Scene {
    private message: Label;
    private timeLabel: Label;
    private mistakesLabel: Label;
    private hintsUsedLabel: Label;
    private menuButton: Button;

    constructor(app: Application, onGoToMenu: () => void) {
        super(app);

        this.message = new Label('You Win!', {
            fontFamily: 'Luckiest Guy',
            fontSize: 120,
            fill: 0xFFFFFF,
            stroke: { color: 0x000000, width: 8 },
        });
        this.message.layout = {
            anchor: Anchor.TOP_CENTER,
            margins: { top: 100 }
        };
        this.addChild(this.message);

        this.timeLabel = new Label('', {
            fontFamily: 'Luckiest Guy',
            fontSize: 60,
            fill: 0xFFFFFF,
        });
        this.timeLabel.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: -80 }
        };
        this.addChild(this.timeLabel);

        this.mistakesLabel = new Label('', {
            fontFamily: 'Luckiest Guy',
            fontSize: 40,
            fill: 0xFFFFFF,
        });
        this.mistakesLabel.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: -20 }
        };
        this.addChild(this.mistakesLabel);

        this.hintsUsedLabel = new Label('', {
            fontFamily: 'Luckiest Guy',
            fontSize: 40,
            fill: 0xFFFFFF,
        });
        this.hintsUsedLabel.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: 40 }
        };
        this.addChild(this.hintsUsedLabel);

        this.menuButton = new Button('Main Menu', 250, 80, onGoToMenu);
        this.menuButton.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: 120 }
        };
        this.addChild(this.menuButton);
    }

    public onEnter(options: { time: string, mistakes: number, hintsUsed: number }): void {
        this.timeLabel.value = `Time: ${options.time}`;
        this.mistakesLabel.value = `Mistakes: ${options.mistakes}`;
        this.hintsUsedLabel.value = `Hints Used: ${options.hintsUsed}`;
        this.resize(this.app.screen.width, this.app.screen.height);
    }

    public update(delta: number): void {}

    public resize(screenWidth: number, screenHeight: number): void {
        const parentBounds = new Rectangle(0, 0, screenWidth, screenHeight);

        this.children.forEach(child => {
            if (child instanceof UIComponent) {
                LayoutSystem.applyLayout(child, parentBounds);
            }
        });
    }
} 