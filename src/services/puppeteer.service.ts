import puppeteer from 'puppeteer';
import { envConfig } from '../utils/config/env.config';

export class PuppeteerService {
    private baseUrl: string;

    constructor() {
        const { baseUrl } = envConfig;
        this.baseUrl = baseUrl;
    }

    async getHtml(url?: string): Promise<string> {
        try {
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.goto(url ? `${this.baseUrl}${url}` : this.baseUrl);

            const html = await page.content();

            await browser.close();

            return html;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
            // return null;
        }
    }
}
