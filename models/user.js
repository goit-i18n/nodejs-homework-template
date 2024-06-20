import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		lowercase: true,
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
		ref: "User",
	},
	avatarURL: {
		type: String,
	},
	verify: {
		type: Boolean,
		default: false,
	},
	verificationToken: {
		type: String,
		required: [true, "Verify token is required"],
	},
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		try {
			const hashedPassword = await bcrypt.hash(this.password, 10);
			this.password = hashedPassword;
		} catch (error) {
			return next(error);
		}
	}
	next();
});

// Method to compare the password
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
