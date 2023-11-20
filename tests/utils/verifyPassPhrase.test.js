describe("Verify pass phrase", () => {
  test("Pass phrase valid", async () => {
    //Prepare
    const clientToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const passPhrase = clientToken + ";" + new Date().toISOString();

    //Execute
    const result = require("../../utils/verifyPassPhrase").verifyPassPhrase({
      passPhrase,
      clientToken,
    });

    //Test
    expect(result).toBe(true);
  });

  test("Client token invalid length", async () => {
    //Prepare
    const clientToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const passPhrase = "invalid;" + new Date().toISOString();

    //Execute
    const result = require("../../utils/verifyPassPhrase").verifyPassPhrase({
      passPhrase,
      clientToken,
    });

    //Test
    expect(result).toBe(false);
  });

  test("Client token does not match", async () => {
    //Prepare
    const clientToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const passPhrase =
      "invalidllinvalidlinvalidlinvalidlinvalid;" + new Date().toISOString();

    //Execute
    const result = require("../../utils/verifyPassPhrase").verifyPassPhrase({
      passPhrase,
      clientToken,
    });

    //Test
    expect(result).toBe(false);
  });

  test("Pass phrase in the future", async () => {
    //Prepare
    const clientToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const passPhrase = clientToken + ";" + date.toISOString();

    //Execute
    const result = require("../../utils/verifyPassPhrase").verifyPassPhrase({
      passPhrase,
      clientToken,
    });

    //Test
    expect(result).toBe(false);
  });

  test("Pass phrase expired", async () => {
    //Prepare
    const clientToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const passPhrase = clientToken + ";" + new Date("2001-01-01").toISOString();

    //Execute
    const result = require("../../utils/verifyPassPhrase").verifyPassPhrase({
      passPhrase,
      clientToken,
    });

    //Test
    expect(result).toBe(false);
  });
});
