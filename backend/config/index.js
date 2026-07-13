import 'dotenv/config';
import Joi from 'joi';

// Define validation schema for environment variables
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  
  CATVTON_API_URL: Joi.string().uri().default('http://localhost:7860'),
  CATVTON_API_KEY: Joi.string().allow('').default(''),
  
  OPENROUTER_API_KEY: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('') }),
  OPENROUTER_BASE_URL: Joi.string().uri().default('https://openrouter.ai/api/v1'),
  OPENROUTER_MODEL: Joi.string().default('openai/gpt-4o-mini'),
  
  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_FILE_SIZE_MB: Joi.number().default(10),
  ALLOWED_IMAGE_TYPES: Joi.string().default('image/jpeg,image/png,image/webp'),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  port:    envVars.PORT,
  nodeEnv: envVars.NODE_ENV,

  catvton: {
    apiUrl: envVars.CATVTON_API_URL,
    apiKey: envVars.CATVTON_API_KEY,
  },

  openrouter: {
    apiKey:  envVars.OPENROUTER_API_KEY,
    baseUrl: envVars.OPENROUTER_BASE_URL,
    model:   envVars.OPENROUTER_MODEL,
  },

  upload: {
    dir:            envVars.UPLOAD_DIR,
    maxFileSizeMb:  envVars.MAX_FILE_SIZE_MB,
    allowedTypes:   envVars.ALLOWED_IMAGE_TYPES.split(','),
  },

  corsOrigins: ['http://localhost:5173', 'http://localhost:3000'],
};
