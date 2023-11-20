describe("Verify pass phrase", () => {
  test("Small valid ip", async () => {
    //Prepare
    const route = "/api/test";
    const ipAddress = "1.1.1.1";
    const ipValid = true;

    //Execute
    const result = require("../../utils/logger").getText({
      route,
      ipAddress,
      ipValid,
    });

    //Test
    expect(result).toBe("    1.1.1.1         ==> /api/test");
  });

  test("Long valid ip", async () => {
    //Prepare
    const route = "/api/test";
    const ipAddress = "111.111.111.111";
    const ipValid = true;

    //Execute
    const result = require("../../utils/logger").getText({
      route,
      ipAddress,
      ipValid,
    });

    //Test
    expect(result).toBe("    111.111.111.111 ==> /api/test");
  });

  test("Small reject ip", async () => {
    //Prepare
    const route = "/api/test";
    const ipAddress = "1.1.1.1";
    const ipValid = false;

    //Execute
    const result = require("../../utils/logger").getText({
      route,
      ipAddress,
      ipValid,
    });

    //Test
    expect(result).toBe("/!\\ 1.1.1.1         ==> /api/test");
  });
});
