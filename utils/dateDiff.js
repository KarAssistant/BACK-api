module.exports.dateDiff = (dateStart, dateEnd) => {
  const timeDifference = dateEnd - dateStart;

  const seconds = Math.floor(timeDifference / 1000) % 60;
  const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) % 30; // Assuming a month has 30 days for simplicity
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30)) % 12;
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

  let result = "";

  if (years > 0) {
    result += `${years} year${years > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a year
  }

  if (months > 0) {
    result += `${months} month${months > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a month
  }

  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a day
  }

  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a hour
  }

  if (minutes > 0) {
    result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }

  if (seconds > 0) {
    result += `${seconds} second${seconds > 1 ? "s" : ""} `;
  }

  if (result == "") {
    result += `${timeDifference} millisecond${timeDifference > 1 ? "s" : ""} `;
  }

  return result.trim();
};
