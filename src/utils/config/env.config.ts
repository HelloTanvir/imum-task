import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
    port: process.env.PORT || 5000,
    baseUrl: process.env.BASE_URL,
    initialUrl:
        '/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc',
};
