import { Assets } from 'pixi.js';
import { assetsManifest } from '../../assets';

export class AssetManager {
    /**
     * Initializes the asset manager and loads all asset bundles.
     * @returns A promise that resolves when all assets are loaded.
     */
    public static async initialize(): Promise<void> {
        await Assets.init({ manifest: assetsManifest });

        // Get all bundle names from the manifest
        const allBundles = assetsManifest.bundles.map(bundle => bundle.name);

        // Load all bundles
        await Assets.loadBundle(allBundles, (progress) => {
            console.log(`Loading assets... ${Math.round(progress * 100)}%`);
        });

        console.log('All assets loaded!');
    }
} 