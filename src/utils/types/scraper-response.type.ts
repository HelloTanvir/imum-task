export interface ScraperResponse {
    count: number;
    data: {
        image: string;
        title: string;
        price: string;
        model: string;
        acceleration: string;
        fuelType: string;
        cylinderVolume: string;
    }[];
}
