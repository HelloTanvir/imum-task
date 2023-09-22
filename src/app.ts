import express, { Application } from 'express';
import { ScraperController } from './controllers/scraper.controller';
import { ScraperService } from './services/scraper.service';
import { envConfig } from './utils/config/env.config';

const { port, baseUrl } = envConfig;

const app: Application = express();

const scraperController = new ScraperController(new ScraperService(baseUrl));

app.get('/scrape', scraperController.scrape.bind(scraperController));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
