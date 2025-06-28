import { Application, Rectangle } from 'pixi.js';
import { Scene } from '../pixi-game-kit/scene/Scene';
import { Button } from '../pixi-game-kit/ui/Button';
import { Label } from '../pixi-game-kit/ui/Label';
import { UIComponent, Anchor } from '../pixi-game-kit/ui/UIComponent';
import { LayoutSystem } from '../pixi-game-kit/layout/LayoutSystem';

export class MainMenuScene extends Scene {
    private title: Label;
    private playButton: Button;
    private difficultyLabel: Label;
    private easyButton: Button;
    private mediumButton: Button;
    private hardButton: Button;

    private selectedDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

    constructor(app: Application, onPlay: (difficulty: 'Easy' | 'Medium' | 'Hard') => void) {
        super(app);

        // Create the title
        this.title = new Label('Sudoku', {
            fontFamily: 'Luckiest Guy',
            fontSize: 120,
            fill: 0xFFFFFF,
            stroke: { color: 0x000000, width: 8 },
        });
        this.title.layout = {
            anchor: Anchor.TOP_CENTER,
            margins: { top: 100 }
        };
        this.addChild(this.title);

        // Difficulty Selection
        this.difficultyLabel = new Label('Difficulty:', { fontFamily: 'Luckiest Guy', fontSize: 60, fill: 0xFFFFFF });
        this.difficultyLabel.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: -80 }
        };
        this.addChild(this.difficultyLabel);

        this.easyButton = new Button('Easy', 225, 90, () => this.selectDifficulty('Easy'), { textStyle: { fontSize: 48 }, borderWidth: 8 });
        this.easyButton.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: 40, left: -275 }
        };
        this.addChild(this.easyButton);

        this.mediumButton = new Button('Medium', 225, 90, () => this.selectDifficulty('Medium'), { textStyle: { fontSize: 48 }, borderWidth: 8 });
        this.mediumButton.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: 40 }
        };
        this.addChild(this.mediumButton);

        this.hardButton = new Button('Hard', 225, 90, () => this.selectDifficulty('Hard'), { textStyle: { fontSize: 48 }, borderWidth: 8 });
        this.hardButton.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: 40, left: 275 }
        };
        this.addChild(this.hardButton);

        this.updateDifficultyButtons();

        // Create the play button
        this.playButton = new Button('Play', 300, 96, () => onPlay(this.selectedDifficulty), { textStyle: { fontSize: 40 }, borderWidth: 8 });
        this.playButton.layout = {
            anchor: Anchor.MIDDLE_CENTER,
            margins: { top: 220 }
        };
        this.addChild(this.playButton);

        this.resize(this.app.screen.width, this.app.screen.height);
    }

    private selectDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard') {
        this.selectedDifficulty = difficulty;
        this.updateDifficultyButtons();
    }

    private updateDifficultyButtons() {
        this.easyButton.alpha = this.selectedDifficulty === 'Easy' ? 1.0 : 0.5;
        this.mediumButton.alpha = this.selectedDifficulty === 'Medium' ? 1.0 : 0.5;
        this.hardButton.alpha = this.selectedDifficulty === 'Hard' ? 1.0 : 0.5;
    }

    public update(delta: number): void {}

    public resize(screenWidth: number, screenHeight: number): void {
        // Since this is a top-level scene, we can use the provided width and height
        // which correspond to our fixed GAME_WIDTH and GAME_HEIGHT.
        const parentBounds = new Rectangle(0, 0, screenWidth, screenHeight);

        this.children.forEach(child => {
            if (child instanceof UIComponent) {
                LayoutSystem.applyLayout(child, parentBounds);
            }
        });
    }
} 