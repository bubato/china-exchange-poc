import axios from "axios";
import { ConsumerWebhook } from "../models/ConsumerWebhook";
import { TransactionDocument } from "../models/Transaction";
import logger from "../util/logger";
import get from "lodash/get";

export const sendWebhookToUser = async (
  userId: string,
  transaction: TransactionDocument
) => {
  try {
    logger.debug("prepare to send webhook");
    const webhooks = await ConsumerWebhook.find({ userId });

    webhooks.forEach((webhook) => {
      const payload = {
        _id: transaction._id,
        paymentMethod: get(transaction, "paymentMethod.name", null),
        timestamp: Math.round(new Date().getTime() / 1000), //get unix timestamp, too lazy to create a new function :D
        amount: transaction.amount,
        customerId: transaction.customerId,
        status: transaction.status,
      };

      logger.debug(
        `sending request to ${webhook.url} with content ${JSON.stringify(
          payload
        )}`
      );

      axios
        .post(webhook.url, JSON.stringify(payload))
        .then((response) => {
          logger.info(
            `sent to webhook ${
              webhook.url
            } successfully with response ${JSON.stringify(response.data)}`
          );
        })
        .catch((e) => {
          logger.info(
            `sent to webhook ${webhook.url} failure with error 
              ${e.message}
            `
          );
        });
    });

    logger.debug("finished to send webhook");
  } catch (e) {
    logger.debug(`error when sending webhook, details : ${JSON.stringify(e)}`);
  }
};
