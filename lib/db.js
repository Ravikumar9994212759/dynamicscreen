import { Client } from 'pg';

let client;

export const connectToDatabase = async () => {
  if (client) {
    return client; 
  }

  client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined, 
  });

  try {
    await client.connect(); 
    console.log('Database connected successfully.');
    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Could not connect to the database');
  }
};

export const closeDatabaseConnection = async () => {
  if (client) {
    await client.end();
    client = null;
    console.log('Database connection closed.');
  }
};
