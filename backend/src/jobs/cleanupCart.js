import cron from "node-cron";
import { retrieveConnection } from "../persistance/db.js";

cron.schedule("* * * * *", async () => {
    try{
        const conn = retrieveConnection();

        await conn.beginTransaction();

        await conn.execute(`
            UPDATE carts
            SET status='expired'
            WHERE
                status='active'
            AND expires_at < NOW()
        `);

        await conn.execute(`
            DELETE ci
            FROM cart_items ci
            INNER JOIN carts c
                ON c.id=ci.cart_id
            WHERE c.status='expired'
        `);

        await conn.commit();

        console.log("Expired carts cleaned.");

    }
    catch(err){

        await retrieveConnection().rollback();

        console.error(err);

    }

});