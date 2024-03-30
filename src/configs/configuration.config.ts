/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env",
});
class ConfigurationService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getEnv(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getEnv(k, true));
    return this;
  }
}

export const getDatabaseConfig = () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    uri: process.env.DATABASE_URI,
  },
});

const configService = new ConfigurationService(process.env).ensureValues([
  "DATABASE_HOST",
  "DATABASE_PORT",
  "DATABASE_URI",
  "DATABASE_NAME",
  "DATABASE_USERNAME",
  "DATABASE_PASSWORD",
]);

export { configService };
