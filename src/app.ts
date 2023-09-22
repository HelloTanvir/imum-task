import express, { Application } from 'express';
import { ScraperController } from './controllers/scraper.controller';
import { ScraperService } from './services/scraper.service';

const app: Application = express();
const PORT = process.env.PORT || 5000;

const baseUrl = 'https://www.otomoto.pl/';

const scraperController = new ScraperController(new ScraperService(baseUrl));

app.get('/scrape', scraperController.scrape.bind(scraperController));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
