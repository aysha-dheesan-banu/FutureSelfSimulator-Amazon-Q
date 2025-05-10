import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default configuration
const defaultConfig = {
  port: 4000,
  host: "localhost",
  dbUrl: "postgres://postgres:postgres@localhost:5432/futurestimulus",
  sessionSecret: "your_session_secret",
  aws: {
    region: "us-east-1",
    accessKeyId: "your_access_key",
    secretAccessKey: "your_secret_key",
    dynamodbEndpoint: "http://localhost:8000"
  },
  openai: {
    apiKey: "your_openai_api_key"
  }
};

// Configuration with environment variables
export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : defaultConfig.port,
  host: process.env.HOST || defaultConfig.host,
  dbUrl: process.env.DATABASE_URL || defaultConfig.dbUrl,
  sessionSecret: process.env.SESSION_SECRET || defaultConfig.sessionSecret,
  rootDir: path.resolve(__dirname, ".."),
  aws: {
    region: process.env.AWS_REGION || defaultConfig.aws.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || defaultConfig.aws.accessKeyId,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || defaultConfig.aws.secretAccessKey,
    dynamodbEndpoint: process.env.DYNAMODB_ENDPOINT || defaultConfig.aws.dynamodbEndpoint
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || defaultConfig.openai.apiKey
  },
  isDevelopment: process.env.NODE_ENV !== "production"
};

export default config;