const fs = require("fs");

describe("Logs purge", () => {
  test("Purge no files", async () => {
    //Execute
    require("../../utils/logPurge").logPurge();
  });

  test("Recent log file", async () => {
    //Prepare
    fs.writeFileSync(__dirname + "/../../logs/test.txt", "test");

    //Execute
    require("../../utils/logPurge").logPurge();

    //Test
    expect(fs.existsSync(__dirname + "/../../logs/test.txt")).toBe(true);

    //Purge
    fs.unlinkSync(__dirname + "/../../logs/test.txt");
  });

  test("Old log file", async () => {
    //Prepare
    fs.writeFileSync(__dirname + "/../../logs/test.txt", "test");

    //Execute
    require("../../utils/logPurge").logPurge({ force: true });

    //Test
    expect(fs.existsSync(__dirname + "/../../logs/test.txt")).toBe(false);
  });
});
