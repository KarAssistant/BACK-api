const timeIntervalAllowed = 5 * 1000;

module.exports.verifyPassPhrase = verifyPassPhrase;
function verifyPassPhrase({ passPhrase, clientToken }) {
  const resultReDate = passPhrase.match(
    /^[a-z0-9]{40};([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
  );
  const resultReClientToken = passPhrase.match(`^${clientToken};.*$`);
  if (!resultReDate || !resultReClientToken) return false; // Regex not match
  const IOSDate = passPhrase.split(";")[1];
  const phraseDate = new Date(IOSDate);
  const nowDate = new Date();
  if (phraseDate > nowDate) return false; // Date from the PassPhrase cant be in the future
  if (nowDate - phraseDate > timeIntervalAllowed) return false; // PassPhrase expired
  return true;
}
