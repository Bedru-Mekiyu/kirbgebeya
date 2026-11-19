import AuthService from "../modules/auth/auth.service.js";

class AuthMiddleware {
  async verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
      req.user = AuthService.verifyToken(token);
      next();
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  authorizeRoles(...roles) {
    return (req, res, next) => {
      try {
        AuthService.checkRole(req.user, roles);
        next();
      } catch (err) {
        res.status(403).json({ message: err.message });
      }
    };
  }

  authorizePermissions(action, resource) {
    return async (req, res, next) => {
      try {
        await AuthService.checkPermission(req.user, action, resource);
        next();
      } catch (err) {
        res.status(403).json({ message: err.message });
      }
    };
  }
}

export default new AuthMiddleware();
