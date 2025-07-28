const config = require(`../config.json`);
const mongoose = require("mongoose");

// Schema for Imitation
const ImitationSchema = new mongoose.Schema({
	thread: String,
	imitation: String
});

const ImitationModel = mongoose.models.Imitation || mongoose.model("Imitation", ImitationSchema);

module.exports = class DMContextContainer {
	constructor(maxMessages, ig) {
		this.context = {};
		this.max = maxMessages;
		this.ig = ig;
	}

	async addMessage(context, thread, user) {
		let threadContext = this.context[thread] || {};
		let userContext = threadContext[user] || [];

		// Try using previous name or fetch from IG
		if (userContext.length > 1 && context.role === "user") {
			context.name = userContext[0].name;
		} else if (userContext.length <= 1 && context.role === "user") {
			let u = await this.ig.user.info(user);
			let username = u.full_name.replace(/[^a-zA-Z0-9/-]+/g, "_");
			if (username.length <= 1) {
				username = u.username.replace(/[^a-zA-Z0-9/-]+/g, "_");
			}
			context.name = username;
		}

		// Maintain max messages per user context
		if (userContext.length >= this.max) {
			userContext.shift();
		}
		userContext.push(context);

		threadContext[user] = userContext;
		this.context[thread] = threadContext;

		// Fetch imitation from MongoDB if not cached
		let imitation;
		if (!this.context[thread]?.imitation) {
			let existing = await ImitationModel.findOne({ thread });

			imitation = config.defaultImitation;
			if (existing && existing.imitation) {
				imitation = existing.imitation;
			}

			this.context[thread].imitation = imitation;
		} else {
			imitation = this.context[thread].imitation;
		}

		console.log(this.context);
		return [{ role: "system", content: imitation }, ...userContext];
	}

	clearAll(thread) {
		this.context[thread] = {};
	}
};
