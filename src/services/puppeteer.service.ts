import puppeteer from 'puppeteer';

export class PuppeteerService {
    constructor(private baseUrl: string) {}

    async getHtml(url?: string): Promise<string> {
        try {
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.goto(url || this.baseUrl);

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
