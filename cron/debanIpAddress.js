const cron = require("node-cron");
const actionDeban = require("../utils/antiSpam").cronDeban;

/* c8 ignore start */
module.exports.start = () => {
  cron
    .schedule("00 * * * * *", () => {
      actionDeban();
    })
    .start();
};
/* c8 ignore stop */
