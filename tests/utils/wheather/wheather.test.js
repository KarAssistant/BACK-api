describe("Utils wheather/index", () => {
  test("No data", async () => {
    process.env.DISABLE_WEATHER_JS = true;

    //Execute
    const result = await require("../../../utils/wheather/index").getWheather({
      city: "Paris",
    });

    //Test
    expect(result).toBe(null);
  });

  test("Weather-js", async () => {
    process.env.DISABLE_WEATHER_JS = false;

    //Execute
    const result = await require("../../../utils/wheather/index").getWheather({
      city: "Paris",
    });

    //Test
    expect(!!result).toBe(true);
  });
});
