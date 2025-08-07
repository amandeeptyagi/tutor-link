import pool from "../config/db.js";

const maintenanceMiddleware = async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT maintenance_mode FROM platform_settings LIMIT 1");
    const maintenanceMode = rows[0]?.maintenance_mode;

    if (maintenanceMode) {
      return res.status(503).json({
        message: "The platform is currently under maintenance. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Maintenance check failed:", error);
    res.status(500).json({ message: "Internal server error during maintenance check." });
  }
};

export default maintenanceMiddleware;
