let lineProgress = "";
module.exports.logSameLine = (text) => {
  if (process.stdout.cursorTo) {
    for (let index = 0; index < text.length; index++) {
      if (text[index] !== lineProgress[index]) {
        process.stdout.cursorTo(index);
        process.stdout.write(text[index]);
      }
    }

    for (let index = text.length; index < lineProgress.length; index++) {
      process.stdout.write(" ");
    }

    lineProgress = text;
  } else {
    console.log(text);
  }
};
