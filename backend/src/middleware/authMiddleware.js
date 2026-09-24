import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next ) => {
  const header =req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "No token"
    });
  }

  const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET );
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
        error: "Invalid token"
        });
    }
};

export const optionalAuthMiddleware = ( req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  } 
  next();
};