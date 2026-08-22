/**
 * Configuration Module
 * 
 * Centralized configuration management for the application.
 * Loads, validates, and exports environment variables with proper type coercion.
 * Includes database connection utilities.
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

/**
 * List of required environment variables
 */
const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'BCRYPT_SALT_ROUNDS',
  'PORT'
];

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
function validateEnvVars() {
  const missingVars = REQUIRED_ENV_VARS.filter(varName => {
    const value = process.env[varName];
    return value === undefined || value === null || value === '';
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file against .env.example'
    );
  }
}

/**
 * Validates and runs the configuration setup
 */
validateEnvVars();

/**
 * Application Configuration Object
 * 
 * All configuration values are typed and validated.
 */
const config = {
  // Server Configuration
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  mongoUri: process.env.MONGO_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },

  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  redisUrl: process.env.REDIS_URL || null,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiVersion: process.env.API_VERSION || 'v1',
  logLevel: process.env.LOG_LEVEL || 'info'
};

/**
 * Validate parsed numeric values
 */
if (isNaN(config.port)) {
  throw new Error('PORT must be a valid number');
}

if (isNaN(config.bcryptSaltRounds) || config.bcryptSaltRounds < 1) {
  throw new Error('BCRYPT_SALT_ROUNDS must be a valid number greater than 0');
}

if (config.nodeEnv !== 'production') {
  console.log('Configuration loaded successfully:');
  console.log({
    port: config.port,
    nodeEnv: config.nodeEnv,
    mongoUri: config.mongoUri ? '***configured***' : 'missing',
    jwtSecret: config.jwt.secret ? '***configured***' : 'missing',
    jwtExpiresIn: config.jwt.expiresIn,
    bcryptSaltRounds: config.bcryptSaltRounds,
    redisUrl: config.redisUrl ? '***configured***' : 'not set',
    corsOrigin: config.corsOrigin
  });
}

Object.freeze(config);
Object.freeze(config.jwt);

let memoryMongoServer = null;

/**
 * Auto-seed default test users if database is empty
 */
async function autoSeedDefaultUsers() {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[INFO] No users found. Auto-seeding default demo accounts...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const defaultUsers = [
        {
          name: 'Hashim Ansari',
          email: 'hashim@example.com',
          organization: 'Green Industries Ltd',
          password: hashedPassword
        },
        {
          name: 'Admin User',
          email: 'admin@example.com',
          organization: 'Kora Metallurgy Platform',
          password: hashedPassword
        },
        {
          name: 'Demo User',
          email: 'demo@example.com',
          organization: 'Aluminium Dynamics',
          password: hashedPassword
        }
      ];

      await User.insertMany(defaultUsers);
      console.log('[INFO] Default demo users seeded successfully (hashim@example.com, admin@example.com, demo@example.com / password: password123)');
    }
  } catch (seedErr) {
    console.warn('[WARN] Auto-seeding users skipped:', seedErr.message);
  }
}

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
async function connectDB() {
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 45000,
  };

  // 1. Try standard connection (e.g. system MongoDB)
  try {
    await mongoose.connect(config.mongoUri, options);
    console.log('[INFO] MongoDB connected successfully');
    console.log(`[INFO] Database: ${mongoose.connection.name}`);
    await autoSeedDefaultUsers();
    return;
  } catch (error) {
    if (config.nodeEnv !== 'production' && (config.mongoUri.includes('localhost') || config.mongoUri.includes('127.0.0.1'))) {
      console.log('[INFO] Local MongoDB service not active. Starting embedded development database...');
      
      const fs = require('fs');
      const path = require('path');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.join(__dirname, '../../.mongo-data');

      // 2. Try persistent embedded instance
      try {
        fs.mkdirSync(dbPath, { recursive: true });
        // Remove stale lock file if previous process was abruptly terminated
        const lockFile = path.join(dbPath, 'mongod.lock');
        if (fs.existsSync(lockFile)) {
          try { fs.unlinkSync(lockFile); } catch (e) { /* ignore */ }
        }

        memoryMongoServer = await MongoMemoryServer.create({
          instance: {
            port: 27017,
            dbPath: dbPath,
            dbName: 'sih69'
          }
        });
        const memUri = memoryMongoServer.getUri();
        await mongoose.connect(`${memUri}sih69`, options);
        console.log('[INFO] Embedded persistent MongoDB connected successfully');
        console.log(`[INFO] Database: ${mongoose.connection.name}`);
        await autoSeedDefaultUsers();
        return;
      } catch (memError) {
        console.warn('[WARN] Persistent embedded MongoDB on 27017 failed, falling back to dynamic in-memory MongoDB:', memError.message);
      }

      // 3. Guaranteed fallback: Dynamic In-Memory MongoDB
      try {
        memoryMongoServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'sih69'
          }
        });
        const memUri = memoryMongoServer.getUri();
        await mongoose.connect(memUri, options);
        console.log('[INFO] Dynamic in-memory MongoDB connected successfully');
        console.log(`[INFO] Database: ${mongoose.connection.name}`);
        await autoSeedDefaultUsers();
        return;
      } catch (dynamicErr) {
        console.error('[ERROR] Dynamic MongoDB startup failed:', dynamicErr.message);
      }
    }

    console.error('[ERROR] MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  try {
    await mongoose.connection.close();
    if (memoryMongoServer) {
      await memoryMongoServer.stop();
    }
    console.log('[INFO] MongoDB disconnected');
  } catch (error) {
    console.error('[ERROR] MongoDB disconnection failed:', error.message);
    throw error;
  }
}

module.exports = {
  ...config,
  connectDB,
  disconnectDB
};
