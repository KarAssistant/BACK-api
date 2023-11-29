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

module.exports.concatDate = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');

  const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

  return formattedDateTime;
}
