import mongoose from 'mongoose';

interface InitOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {

  static async connect(options: InitOptions) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, { dbName });
      console.log('Connected to MongoDB');
      return true;
    } catch (error) {
      console.log('Error connecting to MongoDB');
      throw error;
    }
  }

  static async disconnect() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}
