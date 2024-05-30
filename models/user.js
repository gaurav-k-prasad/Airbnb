const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// ! No need for "username" and "password" as passport-local-mongoose will automatically store username, password, hash and salt field for both of them.

// ? So we need not for username defining and password
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
