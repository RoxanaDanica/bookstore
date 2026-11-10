
import cron from "node-cron";
import { retrieveConnection } from "../persistance/db.js";

let cleanupRunning = false;

cron.schedule("* * * * *", async () => {
    if (cleanupRunning) {
        return;
    }

    cleanupRunning = true;

    let conn;
    let transactionStarted = false;

    try {
        conn = await retrieveConnection().getConnection();

        await conn.beginTransaction();
        transactionStarted = true;

        await conn.execute(`
            UPDATE carts
            SET status = 'expired'
            WHERE status = 'active'
              AND expires_at < NOW()
        `);

        await conn.execute(`
            DELETE ci
            FROM cart_items ci
            INNER JOIN carts c
                ON c.id = ci.cart_id
            WHERE c.status = 'expired'
        `);

        await conn.commit();
        transactionStarted = false;

        console.log("Expired carts cleaned.");
    } catch (err) {
        if (conn && transactionStarted) {
            try {
                await conn.rollback();
            } catch (rollbackError) {
                console.error(
                    "Cart cleanup rollback failed:",
                    rollbackError
                );
            }
        }

        console.error("Cart cleanup failed:", err);
    } finally {
        if (conn) {
            conn.release();
        }

        cleanupRunning = false;
    }
});
