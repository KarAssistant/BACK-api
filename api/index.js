module.exports.startApi = (app) => {
  require("./query").start(app);
  require("./client/client").start(app);
  require("./user/update").start(app);
  require("./user/history").start(app);
};
