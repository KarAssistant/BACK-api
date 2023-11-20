const timeIntervalAllowed = 5 * 1000;

module.exports.test = ({ clientDate }) => {
  const date = new Date(clientDate);
  const nowDate = new Date();

  // Add date validation
  if (date > nowDate) return false; // Date cant be in the future
  if (nowDate - date > timeIntervalAllowed) return false; // Request expired

  return true;
};
