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

    // Auto-seed Demo Workflows & Reports for Hashim
    await autoSeedDemoWorkflows();
  } catch (seedErr) {
    console.warn('[WARN] Auto-seeding users skipped:', seedErr.message);
  }
}

/**
 * Auto-seed realistic demo workflows (Copper & Aluminium) for testing & demo presentations
 */
async function autoSeedDemoWorkflows() {
  try {
    const User = require('../models/User');
    const CopperWorkflow = require('../models/CopperWorkflow');
    const WizardWorkflow = require('../models/WizardWorkflow');
    const Report = require('../models/Report');

    const defaultUser = await User.findOne({ email: 'hashim@example.com' }) || await User.findOne();
    if (!defaultUser) return;

    // 1. Seed Demo Copper Workflow
    const existingCopper = await CopperWorkflow.findOne({ userId: defaultUser._id, name: 'Malanjkhand Copper Smelting & Circularity Project' });
    if (!existingCopper) {
      console.log('[INFO] Seeding completed Copper demo project...');
      const copperDoc = await CopperWorkflow.create({
        name: 'Malanjkhand Copper Smelting & Circularity Project',
        description: 'Complete 7-stage LCA simulation of Malanjkhand chalcopyrite extraction, flash smelting, and circular slag valorization.',
        userId: defaultUser._id,
        metalType: 'Copper',
        status: 'submitted',
        currentStep: 6,
        isCompleted: true,
        completionPercentage: 100,
        completedSteps: [0, 1, 2, 3, 4, 5, 6],
        copperMining: {
          miningMethod: 'open-pit',
          oreType: 'sulfide',
          oreGradePercentCu: 0.95,
          region: 'Asia-Pacific (India - Malanjkhand)',
          depositDepth: 180,
          benchHeight: 12,
          strippingRatio: 4.2,
          tailingsGenerationRate: 920,
          mineProductionPerDay: 6500,
          averageHaulDistance: 3.5,
          mineLifetimeYears: 25,
          fuelConsumption: 450,
          electricityConsumption: 18,
          waterConsumption: 1.2,
          directGhgEmissions: 58.4,
          oreRecovery: 89,
          mining_energy_MJ_per_t_ore: 450,
          mining_co2_kg_per_t_ore: 58.4
        },
        copperBeneficiation: {
          oreType: 'sulfide',
          oreGradePercentCu: 0.95,
          concentrateGradePercentCu: 28.0,
          mineralogyDetails: 'chalcopyrite',
          particleSizeAfterGrinding: 75,
          grindingEnergyKwhPerTonne: 32.5,
          reagentConsumptionKgPerTonne: 0.45,
          flotationCellType: 'mechanical',
          waterConsumptionM3PerTonne: 1.8,
          waterRecycledPercent: 82.0,
          recoveryEfficiencyPercent: 88.5,
          ghgEmissionsKgCo2ePerTonne: 31.2
        },
        copperRefining: {
          processRoute: 'pyrometallurgical',
          oreType: 'sulfide',
          concentrateGradePercentCu: 28.0,
          smeltingTechnique: 'flash',
          smeltingEnergyMjPerTonne: 4800,
          fuelType: 'natural_gas',
          sulfurCaptureEfficiencyPercent: 99.2,
          slagProducedKgPerTonne: 950,
          electrorefiningEnergyKwhPerTonne: 380,
          waterConsumptionM3PerTonnePyro: 2.4,
          acidProducedKgH2SO4PerTonne: 1850,
          ghgEmissionsKgCo2ePerTonne: 2850,
          so2EmissionsKgPerTonne: 1850,
          slagRecyclingRatePercent: 85.0
        },
        copperManufacturing: {
          productType: 'Continuous Cast Copper Rod (8mm)',
          inputCathodePurity: 99.99,
          scrapInput: 25.0,
          castingMethod: 'continuous_casting',
          meltingEnergy: 320,
          processWaterConsumption: 0.9,
          ghgEmissions: 220,
          scrapGenerated: 6.5,
          scrapRecycledOnsite: 100.0,
          productYield: 93.5
        },
        copperUsePhase: {
          productType: 'EV Traction Motor Windings',
          applicationSector: 'Electric Vehicles & Renewable Energy Grid',
          productLifetimeYears: 25,
          efficiencyRating: 98.5,
          energySavingsPercent: 15.0,
          ghgAvoidedPerUnit: 1450,
          reusePotentialPercent: 95.0
        },
        copperRecycling: {
          scrapType: 'No. 1 Bare Bright Wire',
          collectionRate: 78.0,
          sortingTechnology: 'sensor_based',
          remeltingEnergy: 1100,
          recoveredCopperPurity: 99.95,
          recoveryYield: 94.0,
          recycledContent: 80.0,
          ghgEmissions: 480
        },
        copperValorization: {
          wasteType: 'Copper Slag & Flue Gas',
          wasteGeneration: 950,
          valorizationRate: 85.0,
          metalRecoveryRate: 92.0,
          sulfurCaptureEfficiency: 99.2,
          slagReuseAsConstruction: 85.0,
          acidProduced: 1850,
          revenueFromByProducts: 8400000
        }
      });

      // Linked Report
      await Report.create({
        title: 'LCA Report: Malanjkhand Copper Smelting & Circularity Project',
        description: 'Complete 7-stage ISO 14040/44 Life Cycle Assessment for Malanjkhand Copper Complex',
        userId: defaultUser._id,
        author: {
          userId: defaultUser._id,
          name: defaultUser.name,
          email: defaultUser.email
        },
        status: 'final',
        visibility: 'public',
        tags: ['copper', 'lca', 'wizard-generated', 'completed', 'circular-economy'],
        circularityScore: 80.0,
        co2Savings: 2680,
        sections: [
          {
            title: 'Executive Summary',
            order: 0,
            content: 'Comprehensive cradle-to-cradle LCA for Malanjkhand Copper Complex achieving 80% Material Circularity Index (MCI) and 55.6% GWP reduction via TSL scrap remelting and slag/acid valorization.'
          }
        ],
        metadata: {
          sourceType: 'wizard-workflow',
          workflowId: copperDoc._id,
          metalType: 'Copper',
          completionPercentage: 100,
          isCompleted: true
        }
      });
      console.log('[INFO] Copper demo project & report seeded successfully');
    }

    // 2. Seed Demo Aluminium Workflow
    const existingAlum = await WizardWorkflow.findOne({ userId: defaultUser._id, name: 'Odisha Integrated Aluminium Complex' });
    if (!existingAlum) {
      console.log('[INFO] Seeding completed Aluminium demo project...');
      const alumDoc = await WizardWorkflow.create({
        name: 'Odisha Integrated Aluminium Complex',
        description: '7-stage ISO 14040/44 LCA of Bauxite mining, Bayer refining, and Hall-Héroult smelting in Odisha.',
        userId: defaultUser._id,
        metalType: 'Aluminium',
        status: 'submitted',
        currentStep: 6,
        isCompleted: true,
        completionPercentage: 100,
        completedSteps: [0, 1, 2, 3, 4, 5, 6],
        mining: {
          location: 'Odisha, India',
          oreGrade: 46.5,
          overburdenRatio: 3.2,
          mining_energy_MJ_per_t_ore: 580,
          mining_co2_kg_per_t_ore: 62.4
        },
        beneficiation: {
          processes: ['crushing', 'washing_screening'],
          beneficiation_water_m3_per_t_ore: 1.4,
          beneficiation_electricity_kWh_per_t_ore: 22.5
        },
        refining: {
          processes: ['digestion', 'precipitation', 'calcination'],
          refining_energy_MJ_per_t_alumina: 11800,
          refining_red_mud_kg_per_t_alumina: 1250
        },
        smelting: {
          processes: ['pre_baking_anodes', 'electrolysis'],
          energySource: 'Hydropower',
          smelting_energy_kWh_per_t_al: 14200,
          smelting_co2_kg_per_t_al: 1650
        },
        manufacturing: {
          processes: ['casting', 'extrusion'],
          scrapRate: 8.5,
          recycledContent: 35
        },
        recycling: {
          processes: ['collection', 'remelting'],
          recycling_scrap_input_percent: 35,
          recycling_energy_kWh_per_t_Al: 780
        },
        valorization: {
          wasteTypes: ['red_mud', 'dross'],
          valorizationMethods: ['cement_additive', 'dross_recovery'],
          wasteUtilizationPercentages: 72
        }
      });

      // Linked Report
      await Report.create({
        title: 'LCA Report: Odisha Integrated Aluminium Complex',
        description: 'Complete 7-stage ISO 14040/44 Life Cycle Assessment for Odisha Bauxite & Smelter Hub',
        userId: defaultUser._id,
        author: {
          userId: defaultUser._id,
          name: defaultUser.name,
          email: defaultUser.email
        },
        status: 'final',
        visibility: 'public',
        tags: ['aluminium', 'lca', 'wizard-generated', 'completed'],
        circularityScore: 74.5,
        co2Savings: 5200,
        sections: [
          {
            title: 'Executive Summary',
            order: 0,
            content: 'Cradle-to-gate LCA analysis for Odisha primary aluminium smelting integrated with secondary closed-loop recycling and Red Mud valorization into Portland cement.'
          }
        ],
        metadata: {
          sourceType: 'wizard-workflow',
          workflowId: alumDoc._id,
          metalType: 'Aluminium',
          completionPercentage: 100,
          isCompleted: true
        }
      });
      console.log('[INFO] Aluminium demo project & report seeded successfully');
    }
  } catch (err) {
    console.warn('[WARN] Demo workflows seeding skipped:', err.message);
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
