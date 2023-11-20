const fs = require("fs");

function purgeFolder({ force, folder }) {
  const nowDate = new Date();
  const logsFiles = fs.readdirSync(folder);
  for (const logsFile of logsFiles) {
    if (fs.lstatSync(folder + logsFile).isFile()) {
      const stats = fs.statSync(folder + logsFile);
      const mtime = stats.mtime;
      const differenceInTime = nowDate.getTime() - mtime.getTime();
      const differenceInDay = differenceInTime / (1000 * 3600 * 24);
      if (differenceInDay > 7 || force) fs.unlinkSync(folder + logsFile);
    }
  }
}

module.exports.logPurge = (params) => {
  const force = params ? params.force : false;
  purgeFolder({ force, folder: __dirname + "/../logs/" });
  purgeFolder({ force, folder: __dirname + "/../logs/api/" });
};
