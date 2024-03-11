const fs = require("fs");
const crypto = require("crypto");

const generateRandomSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

const secret = generateRandomSecret();

const existingEnvContent = fs.readFileSync(".env", "utf-8");

fs.writeFileSync(".env", `${existingEnvContent}\nJWT_SECRET=${secret}\n`);

console.log("Secret generated and added to .env file.");
