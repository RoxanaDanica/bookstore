import { retrieveConnection } from "./db.js";
import { randomUUID } from "crypto";

export const createConversation = async (user_id) => {
  const id = randomUUID();
  const sql = `
    INSERT INTO conversations (id, user_id)
    VALUES (?, ?)
  `;

  const [result] = await retrieveConnection().execute(sql, [
    id,
    user_id
  ]);
  return {
    id,
    result
  };
};

export const getConversationsByUser = async (user_id) => {

  const sql = `
    SELECT *
    FROM conversations
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  const [rows] = await retrieveConnection().execute(sql, [user_id]);
  return rows;
};

export const deleteConversation = async (id) => {
  const sql = `
    DELETE FROM conversations
    WHERE id = ?
  `;
  const [result] = await retrieveConnection().execute(sql, [id]);
  return result;
};