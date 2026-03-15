import jwt from "jsonwebtoken";

const SECRET_KEY = "ONETECH";
const generated_token = (userid) =>
  jwt.sign({ id: userid }, process.env.SECRET_KEY, { expiresIn: "2m" });

export default generated_token;