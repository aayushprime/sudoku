import { Text, TextStyle, ObservablePoint } from 'pixi.js';
import { UIComponent } from './UIComponent';

export class Label extends UIComponent {
    private text: Text;

    constructor(text: string, style?: Partial<TextStyle>) {
        super();
        this.text = new Text({text, style});
        this.text.anchor.set(0.5);
        this.addChild(this.text);
    }

    public get value(): string {
        return this.text.text;
    }

    public set value(text: string) {
        this.text.text = text;
    }

    public get anchor(): ObservablePoint {
        return this.text.anchor;
    }
} 