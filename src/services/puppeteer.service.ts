import puppeteer, { Browser, Page } from 'puppeteer';

export class PuppeteerService {
    private browser: Browser;
    private page: Page;

    async init(): Promise<void> {
        this.browser = await puppeteer.launch({ headless: 'new' });
    }

    async close(): Promise<void> {
        await this.browser.close();
    }

    async getPage(): Promise<Page> {
        if (!this.page) {
            this.page = await this.browser.newPage();
        }
        return this.page;
    }

    async closePage(): Promise<void> {
        await this.page.close();
        this.page = null;
    }

    async getHtml(url: string): Promise<string> {
        try {
            const page = await this.getPage();
            await page.goto(url);
            const html = await page.content();
            await this.closePage();
            return html;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }
}
