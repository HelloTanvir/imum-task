# OTOMOTO WEB SCRAPER

#### This API will visit every page and collect id and url of each ad. After that, this will visit the ad details pages and scrape fields: `{ item id, title, price, registration date, production date, mileage, power }`

## Installation

```bash
$ git clone https://github.com/HelloTanvir/imum-task.git
```

## Installation

```bash
$ yarn
```

## Running

```bash

# watch mode
$ yarn run start:dev

```

## API end points

| Method | url     | Description                                                                                        | live url                                                     |
| ------ | ------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| GET    | /scrape | scrape all ads from every pages and return the result (this may take a few minutes to get all ads) | [http://localhost:5000/scrape](http://localhost:5000/scrape) |
