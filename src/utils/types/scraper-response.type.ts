export interface ScraperResponse {
    count: number;
    data: {
        image: string;
        title: string;
        price: string;
    }[];
}
