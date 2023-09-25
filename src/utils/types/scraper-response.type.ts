export interface ScraperResponse {
    totalAds: number;
    data: Data[];
}

export interface Data {
    item_id: string;
    title: string;
    price: string;
    registration_date: string;
    production_date: string;
    mileage: string;
    power: string;
}

export interface Item {
    id: string;
    url: string;
}
