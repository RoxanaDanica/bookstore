import { retrieveConnection } from "./db.js";
import { randomUUID } from "crypto";

export const getMessagesByConversation = async (conversationId) => {
  const sql = `
    SELECT role, content
    FROM messages
    WHERE conversation_id = ?
    ORDER BY id ASC
  `;

  const [rows] = await retrieveConnection().execute(sql, [conversationId]);

  return rows;
};

export const createMessage = async (conversationId, role, content) => {
  const id = randomUUID(); 
  const sql = `
    INSERT INTO messages (id, conversation_id, role, content)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await retrieveConnection().execute(sql, [
    id,
    conversationId,
    role,
    content
  ]);

  return result;
};