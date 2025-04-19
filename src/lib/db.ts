// src/lib/db.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error('MONGO_URI not found in environment variables');
}

let isConnected = false;

const connectToMongo = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB successfully.');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

export default connectToMongo;
