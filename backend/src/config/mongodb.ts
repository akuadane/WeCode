import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL ;
const DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

if (!DB_NAME) {
  throw new Error('MONGODB_DB_NAME environment variable is not set');
}

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongoDB = async (): Promise<Db> => {
  try {
    if (client && db) {
      return db;
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect(); 
    db = client.db(DB_NAME);
    console.log('MongoDB database connected successfully');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
    throw error;
  }
};

export const getMongoDB = async (): Promise<Db> => {
  if (!db) {
    return await connectMongoDB();
  }
  return db;
};

export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};
