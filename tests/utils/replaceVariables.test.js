describe("Replace variable", () => {
  test("Replace variables", async () => {
    //Execute
    const result = require("../../utils/replaceVariables").replaceVariables(
      "<@test@>",
      { test: "variable" },
    );

    //Test
    expect(result.match("<@test@>")).toBe(null);
    expect(result.match("variable")[0]).toBe("variable");
  });

  test("Generate existing token", async () => {
    //Execute
    const result = require("../../utils/replaceVariables").replaceVariables(
      "<@test@>",
      {},
    );

    //Test
    expect(result.match("<@test@>")).toBe(null);
    expect(result.match("<@!test!@>")[0]).toBe("<@!test!@>");
  });
});
