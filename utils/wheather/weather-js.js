const weather = require("weather-js");

module.exports.getWheather = async ({ city }) => {
  const { err, result } = await new Promise((resolve) => {
    weather.find(
      { search: city, timeout: 2500, degreeType: "C" },
      function (err, result) {
        resolve({ err, result: result });
      },
    );
  });
  if (err) return null;

  return result;
};
