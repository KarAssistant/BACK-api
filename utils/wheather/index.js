const skiStationData = require("./skiinfo").data;

async function mockWeatherJs({ city }) {
  /* c8 ignore start */
  if (process.env.DISABLE_WEATHER_JS === "true") return null /* c8 ignore stop */;
  else if (city === "Test_good") return null;
  else if (city === "Test_not_good") return null;
  return [
    {
      location: { name: "Paris" },
      current: {
        location: "Paris",
        temperature: "20",
        humidity: "50",
        windSpeed: "20 km/h",
      },
    },
  ];
}

/* c8 ignore start */
const weatherJs = process.env.IS_TEST ? mockWeatherJs : require("./weather-js").getWheather;
/* c8 ignore stop */

module.exports.getWheather = async ({ city, forceNoData }) => {
  if (!forceNoData) {
    const resultWeatherJs = await weatherJs({ city });
    if (skiStationData[city.toLowerCase()]) {
      return { type: "skiinfo", data: skiStationData[city] };
    } else if (resultWeatherJs && resultWeatherJs.length !== 0) {
      const cityResult = resultWeatherJs[0];

      const location = cityResult.location.name;
      const temperature = cityResult.current.temperature;
      const humidity = cityResult.current.humidity;
      const windSpeed = cityResult.current.windspeed;
      const imageUrl = cityResult.current.imageUrl;
      return { type: "weatherJs", location, temperature, humidity, windSpeed, imageUrl };
    }
  }
  return null;
};
