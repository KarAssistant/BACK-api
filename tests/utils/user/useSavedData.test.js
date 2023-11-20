const fs = require("fs");

describe("Load client", () => {
  afterEach(() => {
    const clientToken = "test";

    if (fs.existsSync(__dirname + "/../../../data/users/clients/" + clientToken + ".json"))
      fs.unlinkSync(__dirname + "/../../../data/users/clients/" + clientToken + ".json");
  });

  test("Client exist", async () => {
    //Prepare
    const clientToken = "test";
    fs.writeFileSync(
      __dirname + "/../../../data/users/clients/" + clientToken + ".json",
      JSON.stringify({ test: "test" })
    );

    //Execute
    const result = require("../../../utils/user/useSavedData").loadClient({ clientToken });

    //Test
    expect(result != null).toBe(true);
  });

  test("Client not exist", async () => {
    //Prepare
    const clientToken = "test";

    try {
      require("../../../utils/user/useSavedData").loadClient({ clientToken });
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      //Test
      expect(e).toBe(404);
    }
  });
});

describe("Load user", () => {
  afterEach(() => {
    const userToken = "test";

    if (fs.existsSync(__dirname + "/../../../data/users/users/" + userToken + ".json"))
      fs.unlinkSync(__dirname + "/../../../data/users/users/" + userToken + ".json");
  });

  test("User exist", async () => {
    //Prepare
    const userToken = "test";
    fs.writeFileSync(__dirname + "/../../../data/users/users/" + userToken + ".json", JSON.stringify({ test: "test" }));

    //Execute
    const result = require("../../../utils/user/useSavedData").loadUser({ userToken });

    //Test
    expect(result != null).toBe(true);
  });

  test("User not exist", async () => {
    //Prepare
    const userToken = "test";

    try {
      require("../../../utils/user/useSavedData").loadUser({ userToken });
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      //Test
      expect(e).toBe(404);
    }
  });
});
