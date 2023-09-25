import * as cheerio from 'cheerio';
import { envConfig } from '../utils/config/env.config';
import { Data, Item, ScraperResponse } from '../utils/types/scraper-response.type';
import { PuppeteerService } from './puppeteer.service';

export class ScraperService {
    private puppeteerService: PuppeteerService;
    private $: cheerio.CheerioAPI;
    private items: Item[] = [];

    constructor() {
        this.puppeteerService = new PuppeteerService();
    }

    async openBrowser(): Promise<void> {
        await this.puppeteerService.init();
    }

    async closeBrowser(): Promise<void> {
        await this.puppeteerService.close();
    }

    async loadPage(url: string): Promise<void> {
        const html = await this.puppeteerService.getHtml(url);
        this.$ = cheerio.load(html);
    }

    async scrape(url: string): Promise<ScraperResponse> {
        try {
            const { baseUrl } = envConfig;

            let currentPage = 1;

            await this.openBrowser();

            while (true) {
                await this.loadPage(`${baseUrl}${url}`);

                this.addItems();

                const nextPageUrl = this.getNextPageUrl(currentPage);

                // break if there is no next page or if we reached the limit of 50 pages
                if (!nextPageUrl || currentPage === 50) break;

                url = nextPageUrl;

                currentPage++;
            }

            const totalAdsCount = this.getTotalAdsCount();
            const allScrapedItems: Data[] = [];

            for (const item of this.items) {
                const data = await this.scrapeTruckItem(item);
                allScrapedItems.push(data);
            }

            await this.closeBrowser();

            return {
                totalAds: totalAdsCount,
                data: allScrapedItems,
            };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }

    async scrapeTruckItem(item: Item): Promise<Data> {
        try {
            await this.loadPage(item.url);

            const data = <Data>{};

            const title = this.$('span.offer-title').text().trim();
            data.title = title;

            const price = this.$('span.offer-price__number').text().trim();
            data.price = price;

            this.$('span.offer-params__label').each((index, element) => {
                const parameter = this.$(element).text().trim();
                const value = this.$(element).next().text().trim();

                switch (parameter) {
                    case 'Rok produkcji':
                        data.production_date = value;
                        break;
                    case 'Przebieg':
                        data.mileage = value;
                        break;
                    case 'Moc':
                        data.power = value;
                        break;
                    case 'Data pierwszej rejestracji w historii pojazdu':
                        data.registration_date = value;
                        break;
                }
            });

            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }

    addItems() {
        const sections = this.$('section.ev7e6t817');

        this.$(sections).each((index, section) => {
            const id = this.$(section).parent().attr('data-id').trim();
            const url = this.$(section).find('h1.ev7e6t89.ooa-1xvnx1e.er34gjf0 > a').attr('href');

            this.items.push({ id, url });
        });
    }

    getTotalAdsCount(): number {
        try {
            const totalAds = this.$('p.ev5apm50.ooa-7qbv63.er34gjf0').text();
            const totalAdsCount = Number(totalAds.replace(/\D/g, ''));
            return totalAdsCount;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }

    getNextPageUrl(currentPage: number): string | null {
        try {
            const forwardButton = this.$(
                'li[data-testid="pagination-step-forwards"][title="Next Page"]'
            );

            const isDisabled = forwardButton.attr('aria-disabled') === 'true';
            if (isDisabled) return null;

            // take the last page url and replace the page number with the current page number + 1
            const nextPageUrl = forwardButton
                .prev()
                .find('a')
                .attr('href')
                .replace(/page=\d+/, `page=${currentPage + 1}`);

            return nextPageUrl;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }
}
