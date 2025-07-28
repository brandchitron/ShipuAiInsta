const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  disabled: false,
  run: async ({ message, ig }) => {
    const commandsDir = __dirname;
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js") && file !== "help.js");

    let commandList = [];

    for (const file of commandFiles) {
      try {
        const cmd = require(path.join(commandsDir, file));
        if (cmd.disabled) continue;
        commandList.push(`┃ 🔹 +${cmd.name}`);
      } catch (_) {}
    }

    // Style output
    const msg = [
      "╭─「 🤖 𝙷𝙴𝙻𝙿 𝙼𝙴𝙽𝚄 」",
      ...commandList.sort(),
      "╰──────────────╯",
      "👑 Bot by: Chitron Bhattacharjee"
    ].join("\n");

    await ig.realtime.direct.sendText({
      threadId: message.message.thread_id,
      text: msg
    });
  }
};
