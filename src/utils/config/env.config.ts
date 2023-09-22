import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
    port: process.env.PORT || 5000,
    baseUrl: process.env.BASE_URL,
};
