import { Role, User } from "../models/User";
import md5 from "md5";
import logger from "../util/logger";
import jwt from "jsonwebtoken";

export async function seedAdmin() {
  logger.debug("starting seed admin");
  const admin = {
    fullName: "John Donkisoft",
    username: "admin",
    hashedPassword: md5("123456"),
    roles: ["admin"],
  };

  try {
    const foundAdmin = await User.findOne({
      fullName: admin.fullName,
      username: admin.username,
    });
    logger.debug(`foundAdmin = ${foundAdmin.toJSON()}`);
    foundAdmin.fullName = admin.fullName;
    foundAdmin.username = admin.username;
    foundAdmin.hashedPassword = admin.hashedPassword;
    foundAdmin.roles = admin.roles as Role[];
    await foundAdmin.save();
    logger.debug("update admin success");

    return foundAdmin;
  } catch (e) {
    await User.create(admin);
    logger.debug("create admin success");
    return null;
  }
}

export async function seedAgency() {
  logger.debug("starting seed agency");
  const agency = {
    fullName: "Woang Walao",
    username: "agency",
    hashedPassword: md5("123456"),
    roles: ["agency"],
  };

  try {
    const foundAgency = await User.findOne({
      fullName: agency.fullName,
      username: agency.username,
    });
    logger.debug(`foundAgency = ${foundAgency.toJSON()}`);
    foundAgency.fullName = agency.fullName;
    foundAgency.username = agency.username;
    foundAgency.hashedPassword = agency.hashedPassword;
    foundAgency.roles = agency.roles as Role[];
    logger.debug("update agency success");

    return foundAgency;
  } catch (e) {
    const createdAgency = await User.create(agency);

    logger.debug("create agency success");
    return createdAgency;
  }
}

export async function seedBuyer() {
  logger.debug("starting seed merchandiser");
  const consumer = {
    fullName: "Mah Cho",
    username: "merchandiser",
    hashedPassword: md5("123456"),
    roles: ["merchandiser"],
  };

  try {
    const foundBuyer = await User.findOne({
      fullName: consumer.fullName,
      username: consumer.username,
    });
    logger.debug(`found buyer = ${foundBuyer.toJSON()}`);
    foundBuyer.fullName = consumer.fullName;
    foundBuyer.username = consumer.username;
    foundBuyer.hashedPassword = consumer.hashedPassword;
    foundBuyer.roles = consumer.roles as Role[];
    foundBuyer.appToken = jwt.sign(
      {
        fullName: consumer.fullName,
        id: foundBuyer.id,
        username: consumer.username,
        isAppToken: true,
      },
      "secret",
      { algorithm: "HS256" }
    );

    await foundBuyer.save();
    logger.debug("update merchandiser success");
    return foundBuyer;
  } catch (e) {
    const createdConsumer = await User.create(consumer);
    createdConsumer.appToken = jwt.sign(
      {
        fullName: consumer.fullName,
        id: createdConsumer.id,
        username: consumer.username,
        isAppToken: true,
      },
      "secret",
      { algorithm: "HS256" }
    );

    await createdConsumer.save();
    logger.debug("create merchandiser success");
    return createdConsumer;
  }
}
