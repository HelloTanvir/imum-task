import express, { Application, NextFunction, Request, Response } from 'express';
import { ScraperController } from './controllers/scraper.controller';
import { envConfig } from './utils/config/env.config';

const { port } = envConfig;

const app: Application = express();

const scraperController = new ScraperController();

app.get('/scrape', scraperController.scrape.bind(scraperController));

// handle errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
