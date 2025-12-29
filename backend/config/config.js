export const appConfig = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:4000",

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWTSECRET,
  JWT_EXPIRES_IN: "7d",

  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL: process.env.EMAIL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@ApniEstate.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "apnipass",

  WEBSITE_URL: process.env.WEBSITE_URL || "http://localhost:5173",
  
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AZURE_API_KEY: process.env.AZURE_API_KEY,
  USE_AZURE: process.env.USE_AZURE === "true",
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  MODEL_ID: process.env.MODEL_ID || "mistralai/Mistral-7B-Instruct-v0.2",
};

export const validateConfig = () => {
  const required = [
    "MONGO_URI",
    "JWT_SECRET",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL",
  ];

  const missing = required.filter((key) => !appConfig[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  console.log("✅ Configuration validated successfully");
};
