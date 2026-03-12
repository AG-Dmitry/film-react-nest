export interface AppConfigDatabase {
  driver: string;
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

function parsePort(value: string | undefined): number {
  if (!value) return 5432;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 5432 : parsed;
}

export default (): AppConfig => ({
  database: {
    driver: process.env.DATABASE_DRIVER || 'mongodb',
    url: process.env.DATABASE_URL || '',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parsePort(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME || '',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || '',
  },
});
