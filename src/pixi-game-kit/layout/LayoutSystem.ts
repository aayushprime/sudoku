import { UIComponent, Anchor } from '../ui/UIComponent';
import { Rectangle } from 'pixi.js';

export class LayoutSystem {
    /**
     * Applies layout properties to a UIComponent.
     * @param component The UIComponent to apply the layout to.
     * @param parentBounds The bounds of the parent container.
     */
    public static applyLayout(component: UIComponent, parentBounds: Rectangle) {
        if (!component.layout) {
            return;
        }

        const { anchor = Anchor.TOP_LEFT, margins = {} } = component.layout;
        const { left = 0, top = 0, right = 0, bottom = 0 } = margins;

        const componentWidth = component.width;
        const componentHeight = component.height;

        let finalX = 0;
        let finalY = 0;

        // Horizontal alignment
        if (anchor % 3 === 0) { // LEFT anchors
            finalX = parentBounds.x + left;
        } else if (anchor % 3 === 1) { // CENTER anchors
            finalX = parentBounds.x + parentBounds.width / 2 + left - right;
        } else { // RIGHT anchors
            finalX = parentBounds.x + parentBounds.width - componentWidth - right;
        }

        // Vertical alignment
        if (anchor < 3) { // TOP anchors
            finalY = parentBounds.y + top;
        } else if (anchor < 6) { // MIDDLE anchors
            finalY = parentBounds.y + parentBounds.height / 2 + top - bottom;
        } else { // BOTTOM anchors
            finalY = parentBounds.y + parentBounds.height - componentHeight - bottom;
        }

        component.position.set(finalX, finalY);
    }
} 