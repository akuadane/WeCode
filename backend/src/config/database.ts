import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL!, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`Connected to MongoDB Atlas`);
    console.log(`Database: ${conn.connection.name}`);

    if (conn.connection.db) {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log("Collections in this DB:", collections.map(c => c.name));
    } else {
      console.warn("Database connection object is undefined.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
  };

export { connectDB };
