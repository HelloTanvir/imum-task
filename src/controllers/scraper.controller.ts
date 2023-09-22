import { Request, Response } from 'express';
import { ScraperService } from '../services/scraper.service';
import { envConfig } from '../utils/config/env.config';
import { ScraperRequirements } from '../utils/types/scraper-requirements.type';

export class ScraperController {
    private scraperService: ScraperService;
    private scrapeRequirements: ScraperRequirements;

    constructor() {
        const { initialUrl } = envConfig;

        this.scraperService = new ScraperService();
        this.scrapeRequirements = {
            url: initialUrl,
            currentPage: 1,
        };
    }

    async scrape(req: Request, res: Response): Promise<void> {
        try {
            const { pageUrl } = req.query as { pageUrl: string };

            if (pageUrl) {
                this.scrapeRequirements.url = pageUrl;
                if (!isNaN(parseInt(pageUrl.split('page=')[1]))) {
                    this.scrapeRequirements.currentPage = parseInt(pageUrl.split('page=')[1]);
                }
            }

            const scrapedData = await this.scraperService.scrape(this.scrapeRequirements);
            res.json(scrapedData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while scraping data.' });
        }
    }
}
