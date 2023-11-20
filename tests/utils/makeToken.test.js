const fs = require("fs");

describe("Make token", () => {
  test("Generate token", async () => {
    //Execute
    const result = require("../../utils/makeToken").generateToken({
      type: "data/users/users",
    });

    //Test
    expect(result != null).toBe(true);
  });

  test("Generate existing token", async () => {
    //Prepare
    const token = "test";
    fs.writeFileSync(__dirname + "/../../data/users/users/" + token + ".json", "test");

    //Execute
    const result = require("../../utils/makeToken").generateToken({
      type: "data/users/users",
      token,
    });

    //Test
    expect(result != null).toBe(true);

    //Purge
    fs.unlinkSync(__dirname + "/../../data/users/users/" + token + ".json");
  });
});
