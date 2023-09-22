import express, { Application } from 'express';
import { ScraperController } from './controllers/scraper.controller';
import { envConfig } from './utils/config/env.config';

const { port } = envConfig;

const app: Application = express();

const scraperController = new ScraperController();

app.get('/scrape', scraperController.scrape.bind(scraperController));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
