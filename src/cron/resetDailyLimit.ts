import cron from "node-cron";
import { Timezone } from "tz-offset";
import { resetDailyLimit } from "../service/resetDailyLimit";
import logger from "../util/logger";

const task = cron.schedule(
  "0 0 * * *",
  async () => {
    logger.debug("starting reset daily limit");
    const result = await resetDailyLimit();
    logger.debug(`result: ${result}`);
  },
  {
    scheduled: true,
    timezone: "Asia/Shanghai" as Timezone,
  }
);

export const startResetDailyLimitJob = () => {
  console.log("cron job: startResetDailyLimitJob triggered");
  task.start();
};
