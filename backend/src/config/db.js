const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      return;
    } catch (error) {
      console.warn('Primary MongoDB connection failed, falling back to in-memory MongoDB:', error.message);
    }
  }

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }

  await mongoose.connect(memoryServer.getUri());
}

module.exports = { connectDatabase };
