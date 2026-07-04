import bcrypt from "bcryptjs";

const password = "20042605"; // This is the password you will use to login
const saltRounds = 10;

const hash = await bcrypt.hash(password, saltRounds);

console.log("-------------------------------------------");
console.log("Your New Hash:");
console.log(hash);
console.log("-------------------------------------------");
