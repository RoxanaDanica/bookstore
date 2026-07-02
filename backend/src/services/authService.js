import jwt from "jsonwebtoken";
import { insertGuestUser } from "../persistance/auth.js";

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            type: user.type
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

export const createGuestUser = async () => {
    return await insertGuestUser();
};