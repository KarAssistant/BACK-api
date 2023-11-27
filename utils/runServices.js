const { exec } = require('child_process');
require("dotenv").config();
const servicesVersions = {};

async function runLinuxCommand(command) {
    return await new Promise((resolve, reject) => {
        exec(command, (error, output, standardError) => {
            if (error) {
                reject(`Execution error: ${error}`);
                return;
            }

            resolve(output);
        });
    });
}

module.exports.loadSkills = loadSkills;
async function loadSkills() {
    await runLinuxCommand(`docker run --rm -v ${process.env.ENV_NAME}_kara-data-skills:/home/node/Karassistant_skills/dataSkills codyisthesenate/karassistant-back-skills:${ servicesVersions.skills ? servicesVersions.skills: "latest"} loadSkills`);
    await runLinuxCommand(`docker run --rm -v ${process.env.ENV_NAME}_kara-data-skills:/home/node/Karassistant_sentenseEncoder/skills -v ${process.env.ENV_NAME}_kara-data-vectors:/home/node/Karassistant_sentenseEncoder/data/vectors codyisthesenate/karassistant-back-sentense-encoder:${ servicesVersions.sentenseEncoder ? servicesVersions.sentenseEncoder: "latest"}`);
}
