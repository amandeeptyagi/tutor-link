import pool from "../config/db.js";

export const maintenanceMiddleware = async (req, res, next) => {
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

export const allowRegistrationMiddleware = async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT registration_enabled FROM platform_settings LIMIT 1");
    const registrationEnabled = rows[0]?.registration_enabled;

    if (!registrationEnabled) {
      return res.status(503).json({
        message: "New registration not allow. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Registration check failed:", error);
    res.status(500).json({ message: "Internal server error during Registration check." });
  }
};
