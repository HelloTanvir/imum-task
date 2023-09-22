import { Request, Response } from 'express';
import { ScraperService } from '../services/scraper.service';

export class ScraperController {
    constructor(private scraperService: ScraperService) {}

    async scrape(req: Request, res: Response): Promise<void> {
        try {
            const scrapedData = await this.scraperService.scrape();
            res.json(scrapedData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while scraping data.' });
        }
    }
}
