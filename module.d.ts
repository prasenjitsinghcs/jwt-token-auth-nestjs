declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        DATABASE_URL: string;
        JWT_ACCESS_TOKEN_KEY: string;
        JWT_REFRESH_TOKEN_KEY: string;
    }
}