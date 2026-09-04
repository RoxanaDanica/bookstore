import { retrieveConnection } from "./db.js";
import { randomUUID } from "crypto";

export const getMessagesByConversation = async (conversationId) => {
  const sql = `
    SELECT role, content
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
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

export const findConversation = async ( userId, conversationId ) => {
  const db = retrieveConnection();

  if (conversationId) {
    const [rows] = await db.execute(
      `
      SELECT id, user_id
      FROM conversations
      WHERE id = ?
      AND user_id = ?
      LIMIT 1
      `,
      [conversationId, userId]
    );

    return rows[0] ?? null;
  }

  const [rows] = await db.execute(
    `
    SELECT id, user_id
    FROM conversations
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId]
  );

  return rows[0] ?? null;
};

export const getConversationMessages = async ( conversationId ) => {
  const db = retrieveConnection();

  const [rows] = await db.execute(
    `
    SELECT role, content
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
    `,
    [conversationId]
  );

  return rows.map((message) => ({
    role: message.role,
    text: message.content
  }));
};