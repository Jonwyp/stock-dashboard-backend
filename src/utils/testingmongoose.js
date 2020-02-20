const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 2000
};

const setupMongoServer = async () => {
  let mongoServer;
  try {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, mongoOptions);
  } catch (err) {
    console.error(err);
  }
  return mongoServer;
};

const tearDownMongoServer = async mongoServer => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
module.exports = { setupMongoServer, tearDownMongoServer };
