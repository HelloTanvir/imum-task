import { Request, Response } from 'express';
import { ScraperService } from '../services/scraper.service';
import { envConfig } from '../utils/config/env.config';

export class ScraperController {
    private scraperService: ScraperService;

    constructor() {
        this.scraperService = new ScraperService();
    }

    async scrape(req: Request, res: Response): Promise<void> {
        try {
            const { initialUrl } = envConfig;
            const scrapedData = await this.scraperService.scrape(initialUrl);
            res.json(scrapedData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while scraping data.' });
        }
    }
}
