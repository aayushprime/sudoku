import { Application, Graphics, Text, Rectangle, Container, TextStyle } from 'pixi.js';
import { Scene } from '../pixi-game-kit/scene/Scene';
import { Numpad } from '../pixi-game-kit/ui/Numpad';
import { Anchor, UIComponent } from '../pixi-game-kit/ui/UIComponent';
import { LayoutSystem } from '../pixi-game-kit/layout/LayoutSystem';
import { Label } from '../pixi-game-kit/ui/Label';
import { SceneManager } from '../pixi-game-kit/scene/SceneManager';
import { Button } from '../pixi-game-kit/ui/Button';
import { UIGroup } from '../pixi-game-kit/ui/UIGroup';

const GRID_SIZE = 9;
const CELL_SIZE = 80;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;

export class GameScene extends Scene {
    private puzzle!: number[][];
    private solution!: number[][];
    private playerGrid!: number[][];

    private selectionHighlight!: Graphics;
    private selectedCell: { row: number, col: number } | null = null;
    private numpad!: Numpad;
    private boardContainer!: Container;
    private numberLabels!: Text[][];
    private timerLabel!: Label;
    private validationTints!: Graphics[][];
    private checkButton!: Button;
    private hintButton!: Button;
    private hintHighlight!: Graphics;
    private mistakesLabel!: Label;
    private hintsLabel!: Label;
    private statsContainer!: Container;
    private controlsContainer!: UIGroup;
    private gameAreaContainer!: Container;
    private mainContainer!: Container;
    private mistakes: number = 0;
    private hintsUsed: number = 0;
    private elapsedTime: number = 0;
    private sceneManager: SceneManager;

    constructor(app: Application, sceneManager: SceneManager) {
        super(app);
        this.sceneManager = sceneManager;
    }

    public onEnter(options: { difficulty: 'Easy' | 'Medium' | 'Hard' }): void {
        this.elapsedTime = 0;
        this.mistakes = 0;
        this.hintsUsed = 0;
        
        const difficultyMap = {
            'Easy': 30,
            'Medium': 40,
            'Hard': 50
        };
        const cellsToRemove = difficultyMap[options.difficulty] || 40;

        // Clear previous scene
        this.removeChildren();

        // Setup a single main container for scaling
        this.mainContainer = new Container();
        this.addChild(this.mainContainer);

        // All other containers are children of mainContainer
        this.gameAreaContainer = new Container();
        this.mainContainer.addChild(this.gameAreaContainer);

        this.controlsContainer = new UIGroup();
        this.mainContainer.addChild(this.controlsContainer);
        
        this.boardContainer = new Container();
        this.gameAreaContainer.addChild(this.boardContainer);

        this.statsContainer = new Container();
        this.gameAreaContainer.addChild(this.statsContainer);
        
        // Create UI elements and add to appropriate containers
        this.timerLabel = new Label('Time: 00:00', { fontFamily: 'Luckiest Guy', fontSize: 40, fill: 0xFFFFFF });
        this.statsContainer.addChild(this.timerLabel);

        this.mistakesLabel = new Label('Mistakes: 0', { fontFamily: 'Luckiest Guy', fontSize: 30, fill: 0xFFFFFF });
        this.statsContainer.addChild(this.mistakesLabel);
        
        this.hintsLabel = new Label('Hints: 0', { fontFamily: 'Luckiest Guy', fontSize: 30, fill: 0xFFFFFF });
        this.statsContainer.addChild(this.hintsLabel);

        this.numpad = new Numpad((num) => this.placeNumber(num));
        this.controlsContainer.addChild(this.numpad);

        this.checkButton = new Button('Check', 140, 60, () => this.checkSolution());
        this.controlsContainer.addChild(this.checkButton);

        this.hintButton = new Button('Hint', 140, 60, () => this.useHint());
        this.controlsContainer.addChild(this.hintButton);

        const boardBackground = new Graphics();
        boardBackground.rect(0, 0, BOARD_SIZE, BOARD_SIZE).fill(0xFFFFFF);
        this.boardContainer.addChild(boardBackground);

        this.solution = this.generateSolvedSudoku();
        this.puzzle = this.createPuzzle(this.solution, cellsToRemove);
        this.playerGrid = this.puzzle.map(row => [...row]);

        this.numberLabels = [];
        this.validationTints = [];
        this.drawGrid();
        this.drawNumbers();
        this.createValidationTints();

        this.hintHighlight = new Graphics();
        this.hintHighlight.visible = false;
        this.boardContainer.addChild(this.hintHighlight);
        
        this.selectionHighlight = new Graphics();
        this.selectionHighlight.visible = false;
        this.boardContainer.addChild(this.selectionHighlight);
        
        this.createInteractiveCells();
        
        // --- Perform initial layout once ---
        this.performLayout();
    }

    private selectCell(row: number, col: number) {
        if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
            // Deselect the cell if it's already selected
            this.selectedCell = null;
            this.selectionHighlight.visible = false;
        } else {
            // Select the new cell
            this.selectedCell = { row, col };
            this.selectionHighlight.clear();
            this.selectionHighlight.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            this.selectionHighlight.fill({ color: 0x00BFFF, alpha: 0.3 }); // Deep sky blue highlight
            this.selectionHighlight.visible = true;
        }
    }

    private placeNumber(num: number) {
        if (this.selectedCell) {
            const { row, col } = this.selectedCell;

            // Prevent changing pre-filled puzzle numbers
            if (this.puzzle[row][col] !== 0) {
                return;
            }

            this.playerGrid[row][col] = num;
            
            const label = this.numberLabels[row][col];
            if (num === 0) {
                label.text = '';
            } else {
                label.text = num.toString();
            }

            // Hide tints when a new number is placed
            this.clearAllTints();
            this.checkWinCondition();
        }
    }

    private useHint() {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (this.playerGrid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length === 0) {
            return; // No empty cells to give a hint for
        }

        this.hintsUsed++;
        this.hintsLabel.value = `Hints: ${this.hintsUsed}`;

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { r, c } = emptyCells[randomIndex];

        // Fill the cell with the correct number
        const correctNumber = this.solution[r][c];
        this.playerGrid[r][c] = correctNumber;
        this.numberLabels[r][c].text = correctNumber.toString();
        this.numberLabels[r][c].style.fill = 0x00BFFF; // Make sure it's player color

        // Highlight the cell temporarily
        this.hintHighlight.clear()
            .rect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            .fill({ color: 0xFFFF00, alpha: 0.5 }); // Yellow highlight
        this.hintHighlight.visible = true;

        setTimeout(() => {
            this.hintHighlight.visible = false;
        }, 1000); // Highlight for 1 second

        this.clearAllTints(); // Clear validation tints after using a hint
        this.checkWinCondition();
    }

    private checkSolution() {
        let allCorrect = true;
        let isFull = true;
        let mistakesInCheck = 0;

        for (let r = 0; r < this.playerGrid.length; r++) {
            for (let c = 0; c < this.playerGrid[r].length; c++) {
                const playerNumber = this.playerGrid[r][c];
                const isPuzzleTile = this.puzzle[r][c] !== 0;

                if (isPuzzleTile) continue; // Don't check pre-filled numbers

                if (playerNumber === 0) {
                    isFull = false;
                    this.validationTints[r][c].visible = false;
                    continue; // Don't tint empty cells
                }

                if (playerNumber === this.solution[r][c]) {
                    this.validationTints[r][c].tint = 0x00FF00; // Green
                    this.validationTints[r][c].alpha = 0.3;
                    this.validationTints[r][c].visible = true;
                } else {
                    this.validationTints[r][c].tint = 0xFF0000; // Red
                    this.validationTints[r][c].alpha = 0.3;
                    this.validationTints[r][c].visible = true;
                    allCorrect = false;
                    mistakesInCheck++;
                }
            }
        }
        
        this.mistakes += mistakesInCheck;
        this.mistakesLabel.value = `Mistakes: ${this.mistakes}`;

        if (isFull && allCorrect) {
            this.checkWinCondition();
        }
    }

    private clearAllTints() {
        for (let r = 0; r < this.validationTints.length; r++) {
            for (let c = 0; c < this.validationTints[r].length; c++) {
                this.validationTints[r][c].visible = false;
            }
        }
    }

    private checkWinCondition() {
        let isFull = true;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (this.playerGrid[r][c] === 0) {
                    isFull = false;
                    break;
                }
            }
            if (!isFull) break;
        }

        if (isFull) {
            let isCorrect = true;
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (this.playerGrid[r][c] !== this.solution[r][c]) {
                        isCorrect = false;
                        break;
                    }
                }
                if (!isCorrect) break;
            }

            if (isCorrect) {
                console.log("You Win!");
                this.sceneManager.goTo('game-end', {
                    time: this.timerLabel.value.replace('Time: ', ''),
                    mistakes: this.mistakes,
                    hintsUsed: this.hintsUsed
                });
            } else {
                console.log("Something is wrong!");
                 // Optionally provide feedback to the player
            }
        }
    }

    private createInteractiveCells() {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const interactiveCell = new Graphics();
                interactiveCell.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                interactiveCell.fill({ color: 0xFFFFFF, alpha: 0.001 }); // Make it interactive but invisible
                interactiveCell.eventMode = 'static';
                interactiveCell.cursor = 'pointer';

                // Only allow selection of empty cells
                if (this.puzzle[row][col] === 0) {
                    interactiveCell.on('pointerdown', () => this.selectCell(row, col));
                }
                
                this.boardContainer.addChild(interactiveCell);
            }
        }
    }

    private generateSolvedSudoku(): number[][] {
        return [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ];
    }

    private drawGrid() {
        const gridGraphics = new Graphics();
        
        for (let i = 0; i <= GRID_SIZE; i++) {
            const isThick = i % 3 === 0;
            const lineWidth = isThick ? 4 : 2;
            const color = isThick ? 0x333333 : 0xCCCCCC;

            gridGraphics.rect(i * CELL_SIZE - (lineWidth / 2), 0, lineWidth, BOARD_SIZE).fill(color);
            gridGraphics.rect(0, i * CELL_SIZE - (lineWidth / 2), BOARD_SIZE, lineWidth).fill(color);
        }
        
        this.boardContainer.addChild(gridGraphics);
    }

    private drawNumbers() {
        for (let row = 0; row < GRID_SIZE; row++) {
            this.numberLabels[row] = [];
            for (let col = 0; col < GRID_SIZE; col++) {
                const number = this.playerGrid[row][col];
                const isPuzzleNumber = this.puzzle[row][col] !== 0;

                let text: Text;

                const baseStyle: Partial<TextStyle> = {
                    fontFamily: 'Luckiest Guy',
                    fontSize: 32,
                    align: 'center',
                };
                
                const numberStyle: Partial<TextStyle> = isPuzzleNumber
                    ? { ...baseStyle, fill: 0x000000 } // Black for puzzle numbers
                    : { ...baseStyle, fill: 0x00BFFF }; // Blue for player numbers

                if (number !== 0) {
                    text = new Text({ text: number.toString(), style: numberStyle });
                } else {
                    text = new Text({ text: '', style: numberStyle });
                }
                
                text.anchor.set(0.5);
                text.x = col * CELL_SIZE + CELL_SIZE / 2;
                text.y = row * CELL_SIZE + CELL_SIZE / 2;
                this.boardContainer.addChild(text);
                this.numberLabels[row][col] = text;
            }
        }
    }

    private createPuzzle(solution: number[][], difficulty: number): number[][] {
        const puzzle = solution.map(row => [...row]);
        let removed = 0;

        while (removed < difficulty) {
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                removed++;
            }
        }
        return puzzle;
    }

    public update(delta: number): void {
        this.elapsedTime += delta / 60; // Assuming 60 FPS
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = Math.floor(this.elapsedTime % 60);
        this.timerLabel.value = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    private performLayout(): void {
        // --- Game Area Layout ---
        this.statsContainer.x = 0;
        this.statsContainer.y = 0;
        
        this.timerLabel.anchor.set(0.5, 0);
        this.timerLabel.x = BOARD_SIZE / 2;
        this.timerLabel.y = 0;
        
        this.mistakesLabel.anchor.set(0, 0);
        this.mistakesLabel.x = 0;
        this.mistakesLabel.y = 50;
        
        this.hintsLabel.anchor.set(1, 0);
        this.hintsLabel.x = BOARD_SIZE;
        this.hintsLabel.y = 50;

        this.boardContainer.x = 0;
        this.boardContainer.y = this.statsContainer.y + 100;
        
        // Position controls container below the game area
        this.controlsContainer.y = this.gameAreaContainer.height + 80;
        this.controlsContainer.x = BOARD_SIZE / 2;

        // Position children within controlsContainer (these are relative to the container's pivot)
        const checkHintWidth = this.checkButton.width;
        const numpadWidth = this.numpad.width;
        const totalControlsWidth = checkHintWidth + numpadWidth + 20;

        this.checkButton.x = -totalControlsWidth / 2 + checkHintWidth / 2;
        this.checkButton.y = 0;
        
        this.hintButton.x = -totalControlsWidth / 2 + checkHintWidth / 2;
        this.hintButton.y = this.checkButton.height + 10;
        
        this.numpad.x = this.checkButton.x + checkHintWidth / 2 + 20 + numpadWidth / 2;
        this.numpad.y = (10 + this.checkButton.height) / 2;
    }

    public resize(screenWidth: number, screenHeight: number): void {
        if (!this.mainContainer) return;

        const logicalWidth = this.mainContainer.width / this.mainContainer.scale.x;
        const logicalHeight = this.mainContainer.height / this.mainContainer.scale.y;

        if (logicalWidth === 0 || logicalHeight === 0) return;

        const scaleX = screenWidth / logicalWidth;
        const scaleY = screenHeight / logicalHeight;
        const scale = Math.min(scaleX, scaleY);

        this.mainContainer.scale.set(scale);
        this.mainContainer.x = (screenWidth - this.mainContainer.width) / 2;
        this.mainContainer.y = (screenHeight - this.mainContainer.height) / 2;
    }

    private createValidationTints() {
        for (let row = 0; row < GRID_SIZE; row++) {
            this.validationTints[row] = [];
            for (let col = 0; col < GRID_SIZE; col++) {
                const tint = new Graphics();
                tint.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                    .fill(0xFFFFFF); // Start with white, tint will change color
                tint.visible = false;
                this.boardContainer.addChild(tint);
                this.validationTints[row][col] = tint;
            }
        }
    }
}