import logger from "../util/logger";
import bluebird from "bluebird";
import mongoose from "mongoose";
import { MONGODB_URI } from "./../util/secrets";
import { seedAdmin, seedAgency, seedBuyer } from "./user";

async function connectDB() {
  const mongoUrl = MONGODB_URI;
  mongoose.Promise = bluebird;

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    logger.error(
      "MongoDB connection error. Please make sure MongoDB is running. " + e
    );
  }
}

async function main() {
  await connectDB();
  await seedAdmin();
  await seedAgency();
  await seedBuyer();
  process.exit();
}

main();
