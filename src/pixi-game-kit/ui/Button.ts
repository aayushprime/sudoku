import { Graphics, TextStyle, Text } from 'pixi.js';
import { UIComponent } from './UIComponent';

/**
 * A simple Button component.
 * Now with graphics, text, and interactivity!
 */
export class Button extends UIComponent {
    private background: Graphics;
    public labelText: Text;

    private _width: number = 0;
    private _height: number = 0;
    private _borderWidth: number;

    constructor(
        labelText: string,
        width: number,
        height: number,
        onClick: () => void,
        options: {
            textStyle?: Partial<TextStyle>;
            borderWidth?: number;
        } = {}
    ) {
        super();

        this._width = width;
        this._height = height;
        this._borderWidth = options.borderWidth ?? 2;

        this.background = new Graphics();

        const buttonTextStyle: Partial<TextStyle> = {
            fontFamily: 'Luckiest Guy',
            fontSize: 32,
            fill: 0xFFFFFF,
            align: 'center',
            ...(options.textStyle ?? {}),
        };
        this.labelText = new Text({text: labelText, style: buttonTextStyle});
        this.labelText.anchor.set(0.5);

        this.addChild(this.background);
        this.addChild(this.labelText);

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on('pointerdown', onClick);
        this.on('pointerover', () => this.scale.set(1.1));
        this.on('pointerout', () => this.scale.set(1.0));

        this.drawBackground();
        this.updateLabelPosition();
    }

    private drawBackground(): void {
        this.background.clear();
        this.background.roundRect(-this._width / 2, -this._height / 2, this._width, this._height, 8)
            .fill(0x000000)
            .stroke({ width: this._borderWidth, color: 0xFFFFFF });
    }

    private updateLabelPosition(): void {
        this.labelText.x = 0;
        this.labelText.y = 0;
    }

    public get width(): number {
        return this._width * this.scale.x;
    }

    public set width(value: number) {
        this._width = value;
        this.drawBackground();
        this.updateLabelPosition();
    }

    public get height(): number {
        return this._height * this.scale.y;
    }

    public set height(value: number) {
        this._height = value;
        this.drawBackground();
        this.updateLabelPosition();
    }
} 