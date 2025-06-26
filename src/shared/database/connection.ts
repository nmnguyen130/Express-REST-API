import 'reflect-metadata';

import { AppDataSource } from '@/shared/config/database.config';

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Error during Data Source initialization', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database disconnected');
    }
  } catch (error) {
    console.error('Error during Data Source disconnection', error);
    throw error;
  }
};

// Handle application shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
