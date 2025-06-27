import { Container, Graphics } from 'pixi.js';
import { Button } from './Button';
import { UIComponent } from './UIComponent';

export class Numpad extends UIComponent {
    constructor(onNumberClick: (num: number) => void) {
        super();

        const buttonSize = 60;
        const spacing = 10;
        const cols = 5;
        const rows = 2;

        const totalWidth = cols * buttonSize + (cols - 1) * spacing;
        const totalHeight = rows * buttonSize + (rows - 1) * spacing;

        const xOffset = -totalWidth / 2;
        const yOffset = -totalHeight / 2;

        // Numbers 1-9
        for (let i = 1; i <= 9; i++) {
            const row = i <= 5 ? 0 : 1;
            const col = i <= 5 ? i - 1 : i - 6;

            const button = new Button(i.toString(), buttonSize, buttonSize, () => onNumberClick(i));
            button.x = xOffset + col * (buttonSize + spacing) + buttonSize / 2;
            button.y = yOffset + row * (buttonSize + spacing) + buttonSize / 2;
            this.addChild(button);
        }

        // Clear Button (X)
        const clearButton = new Button('X', buttonSize, buttonSize, () => onNumberClick(0));
        clearButton.x = xOffset + 4 * (buttonSize + spacing) + buttonSize / 2;
        clearButton.y = yOffset + 1 * (buttonSize + spacing) + buttonSize / 2;
        this.addChild(clearButton);
    }
} 