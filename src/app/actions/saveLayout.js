'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const CONFIG_PATH = path.join(process.cwd(), 'src/lib/home-layout-config.js');

export async function saveLayoutConfig(newConfig) {
    try {
        const fileContent = `/**
 * Home Layout Configuration
 * Defines vertical alignment (padding-top) for Home page sections.
 * Edited via /layout-lab
 */

export const HOME_LAYOUT_CONFIG = ${JSON.stringify(newConfig, null, 4)};
`;

        await fs.writeFile(CONFIG_PATH, fileContent, 'utf-8');

        // Revalidate pages that use this config
        revalidatePath('/');
        revalidatePath('/layout-lab');

        return { success: true };
    } catch (error) {
        console.error('Failed to save layout config:', error);
        return { success: false, error: error.message };
    }
}
