import { Container } from 'pixi.js';

/**
 * Defines the anchor points for UI component layout.
 */
export enum Anchor {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    MIDDLE_LEFT,
    MIDDLE_CENTER,
    MIDDLE_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
}

/**
 * Defines the margin properties for a UI component.
 */
export interface Margins {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

/**
 * Encapsulates all layout properties for a UI component.
 */
export interface LayoutProps {
    anchor?: Anchor;
    margins?: Margins;
}

/**
 * Base class for all UI components in the framework.
 * It extends Pixi's Container and adds a layer for UI-specific logic.
 */
export abstract class UIComponent extends Container {
    public layout?: LayoutProps;

    constructor() {
        super();
    }

    // Future methods for layout, styling, and state management will go here.
} 