import * as cheerio from 'cheerio';
import { ScraperResponse } from '../utils/types/scraper-response.type';
import { PuppeteerService } from './puppeteer.service';

export class ScraperService {
    private puppeteerService: PuppeteerService;

    constructor(private baseUrl: string) {
        this.puppeteerService = new PuppeteerService(this.baseUrl);
    }

    async scrape(): Promise<ScraperResponse> {
        try {
            const html = await this.puppeteerService.getHtml();

            const $ = cheerio.load(html);

            const carListings = $('a.eyfugsy2');

            const data = carListings
                .map((index, element) => {
                    const image = $(element).find('img').attr('src');
                    const title = $(element).find('[data-testid="ad-card-title"]').text();
                    const price = $(element).find('[data-testid="ad-card-price"]').text();

                    return { image, title, price };
                })
                .get();

            return {
                count: data.length,
                data,
            };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }
}
