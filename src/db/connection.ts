import { connect, disconnect } from "mongoose";

async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    throw new Error(`Could not connect to the MongoDB ${error}`);
  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  } catch (error) {
    throw new Error(`Could not disconnect the MongoDB ${error}`);
  }
}

export { connectToDatabase, disconnectFromDatabase };
