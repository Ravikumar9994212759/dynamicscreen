import { Client } from 'pg';

// Create a new client instance
let client;

export const connectToDatabase = async () => {
  if (client) {
    return client; // Return the existing client if already connected
  }

  // Initialize the database connection using environment variables
  client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect(); // Establish the connection
    console.log('Database connected successfully.');
    return client; // Return the client instance after successful connection
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Could not connect to the database');
  }
};

// A function to close the connection, if needed
export const closeDatabaseConnection = async () => {
  if (client) {
    await client.end();
    console.log('Database connection closed.');
  }
};
