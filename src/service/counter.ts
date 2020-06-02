import logger from "../util/logger";

let counter = 0;

export function getCounter() {
  return counter;
}

export function increaseCounter(threshold: number) {
  logger.debug(`counter: ${counter}`);
  logger.debug(`threshold: ${threshold}`);
  if (counter >= threshold - 1) {
    counter = 0;
  } else {
    counter++;
  }
}
