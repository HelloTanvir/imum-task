import puppeteer from 'puppeteer';

export class PuppeteerService {
    async getHtml(url: string): Promise<string> {
        try {
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();

            await page.goto(url, { waitUntil: 'load' });
            const html = await page.content();

            await page.close();
            await browser.close();

            return html;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }
}
