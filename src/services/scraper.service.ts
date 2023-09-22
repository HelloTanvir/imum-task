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

            const carListings = $('article.e1gbziix0');

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
                data,
            };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while scraping data.');
        }
    }
}
