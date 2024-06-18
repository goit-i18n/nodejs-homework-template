import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter",
	},
	token: {
		type: String,
		default: null,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

// Method to compare the password
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
