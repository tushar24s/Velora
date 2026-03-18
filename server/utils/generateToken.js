import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "dev-secret-change-me", {
    expiresIn: "30d",
  });

export default generateToken;

