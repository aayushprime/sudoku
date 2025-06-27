import type { AssetsManifest } from 'pixi.js';

export const assetsManifest: AssetsManifest = {
    bundles: [
        {
            name: 'ui-assets',
            assets: {
                // The user will need to provide a font file here.
                // For now, this is a placeholder.
                'ui-font': 'assets/luckiest-guy.ttf', 
            },
        },
        // We can add more bundles here later (e.g., for game levels)
    ],
}; 