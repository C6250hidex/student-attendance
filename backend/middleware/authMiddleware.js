import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure both are lowercase to prevent casing bugs
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: `Role ${req.user.role} is not authorized` });
    }
    next();
  };
};
