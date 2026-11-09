export const adminMiddleware = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isDemoMode = process.env.PUBLIC_DEMO === "true";

  if (isProduction || isDemoMode) {
    return res.status(403).json({
      message: "Administrative operations are disabled.",
    });
  }

  next();
};