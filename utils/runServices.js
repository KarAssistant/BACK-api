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
    try {
        await runLinuxCommand(`docker run --rm -v ${process.env.ENV_NAME}_kara-data-skills:/home/node/Karassistant_skills/dataSkills codyisthesenate/karassistant-back-skills:${servicesVersions.skills ? servicesVersions.skills: "latest"} loadSkills`);
        await runLinuxCommand(`docker run --rm -v ${process.env.ENV_NAME}_kara-data-skills:/home/node/Karassistant_sentenseEncoder/skills -v ${process.env.ENV_NAME}_kara-data-vectors:/home/node/Karassistant_sentenseEncoder/data/vectors codyisthesenate/karassistant-back-sentense-encoder:${ servicesVersions.sentenseEncoder ? servicesVersions.sentenseEncoder: "latest"}`);          
    } catch {
        console.log('\x1b[33mDocker not supported\x1b[0m');
    }
}

module.exports.runSkills = runSkills;
async function runSkills({ idRequest }) {
    try {
        await runLinuxCommand(`docker run --rm -v ${process.env.ENV_NAME}_kara-data:/data/Karassistant/data codyisthesenate/karassistant-back-skills:${servicesVersions.skills ? servicesVersions.skills: "latest"} ${idRequest}`);        
        return true;
    } catch {
        console.log('\x1b[33mDocker not supported\x1b[0m');
        return false;
    }
}
