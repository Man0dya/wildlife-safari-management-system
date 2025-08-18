import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Staff from "../models/Staff.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return secret;
};

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    
    // Get user information
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // Set user info in request
    req.user = user;
    
    // If token has role field, use it; otherwise use user's role from database
    if (decoded.role) {
      req.user.role = decoded.role;
    }

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Authentication error" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    // Check if user is admin (authenticateToken already ran)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authorization error" });
  }
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
export const requireStaff = async (req, res, next) => {
  try {
    // Check if user is staff or admin (authenticateToken already ran)
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Staff or admin access required" });
    }
    
    next();
    
  } catch (error) {
    return res.status(500).json({ message: "Authorization error" });
  }
};

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // First authenticate the token
      await authenticateToken(req, res, async (err) => {
        if (err) return next(err);
        
        // Check if user has one of the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ 
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
          });
        }
        
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: "Authorization error" });
    }
  };
};
