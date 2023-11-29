const fs = require("fs");

async function start(){
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Please add sentence to kara');
  } else {
    const concatenatedString = args.join(' ');

  const userToken = "test";
    
  if (!fs.existsSync(__dirname + "/data/users/users/" + userToken + ".json")){
    const creationDate = new Date();
    const data = {
      creationDate,
      lastRequestDate: creationDate,
      clients: [],
      data: {},
    };
  
    fs.writeFileSync(
      __dirname + "/data/users/users/" + userToken + ".json",
      JSON.stringify(data)
    );
  }
  

  await require("./universalSentenceEncoder/index").start();
  require("./universalSentenceEncoder/index").getAnswer({ userToken, query: concatenatedString, ipAddress: "127.0.0.1" })
  }
}

start()
