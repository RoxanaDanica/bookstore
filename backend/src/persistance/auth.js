import { retrieveConnection } from "./db.js";
import { v4 as uuidv4 } from "uuid";

export const getUserByEmail = async (email) => {
  const [rows] = await retrieveConnection().execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

export const createUser = async (user) => {
  const { name, email, password_hash } = user;

  const [result] = await retrieveConnection().execute(
    `INSERT INTO users (id, name, email, password_hash, type)
     VALUES (UUID(), ?, ?, ?, 'user')`,
    [name, email, password_hash]
  );

  return {
    id: result.insertId,
    name,
    email
  };
};

export const insertGuestUser = async () => {
  const id = uuidv4();
  const [result] = await retrieveConnection().execute(
    `INSERT INTO users (id, name, email, password_hash, type)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      "Guest",
      null,
      null,
      "guest"
    ]
  );
  return {
    id,
    name: "Guest",
    type: "guest"
  };
};