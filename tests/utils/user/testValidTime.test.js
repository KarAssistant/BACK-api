describe("Test valid time", () => {
  test("Time valid", async () => {
    //Prepare
    const clientDate = new Date();

    //Execute
    const result = require("../../../utils/user/testValidTime").test({ clientDate });

    //Test
    expect(result).toBe(true);
  });

  test("Time expired", async () => {
    //Prepare
    const clientDate = new Date(new Date().getTime() - 6000);

    //Execute
    const result = require("../../../utils/user/testValidTime").test({ clientDate });

    //Test
    expect(result).toBe(false);
  });

  test("Time in the future", async () => {
    //Prepare
    const clientDate = new Date(new Date().getTime() + 1000);

    //Execute
    const result = require("../../../utils/user/testValidTime").test({ clientDate });

    //Test
    expect(result).toBe(false);
  });
});
