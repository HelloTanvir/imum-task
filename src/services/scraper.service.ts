import * as cheerio from 'cheerio';
import { ScraperRequirements } from '../utils/types/scraper-requirements.type';
import { ScraperResponse } from '../utils/types/scraper-response.type';
import { PuppeteerService } from './puppeteer.service';

export class ScraperService {
    private puppeteerService: PuppeteerService;

    constructor() {
        this.puppeteerService = new PuppeteerService();
    }

    async scrape({ url, currentPage = 1 }: ScraperRequirements): Promise<ScraperResponse> {
        try {
            const html = await this.puppeteerService.getHtml(url);

            const $ = cheerio.load(html);

            const carListings = $('article.e1gbziix0');
            console.log('carListings', carListings);

            const data: ScraperResponse['data'] = carListings
                .map((index, element) => {
                    const image = $(element).find('img').attr('src');
                    const title = $(element).find('h2.ebw6llc0.ooa-16u688i.er34gjf0').text().trim();
                    const price = $(element).find('div.ooa-80vtuv.er34gjf0').text().trim();

                    const featureList = $(element).find('ul.ooa-zzhv62.eknsrtg0').children();

                    const [model, acceleration, fuelType, cylinderVolume] = featureList
                        .map((index, element) => {
                            return $(element).text().trim();
                        })
                        .get();

                    return {
                        image,
                        title,
                        price,
                        model,
                        acceleration,
                        fuelType,
                        cylinderVolume,
                    };
                })
                .get();

            return {
                count: data.length,
                nextPageUrl: this.getNextPageUrl(currentPage, $),
                data,
            };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }

    getNextPageUrl(currentPage: number, $: cheerio.CheerioAPI): string | null {
        const nextPage = $(
            `li[data-testid="pagination-list-item"][aria-label="Page ${currentPage + 1}"] > a`
        );

        if (nextPage.length === 0) return null;

        const nextPageUrl = nextPage.attr('href');

        return nextPageUrl;
    }
}
