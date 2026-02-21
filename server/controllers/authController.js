const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
    role,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
            INSERT INTO users (first_name, last_name, email, password, phone, dob, gender, address, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, role`;

    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone,
      dob,
      gender,
      address,
      role,
    ];
    const results = await pool.query(query, values);

    res.status(201).json({ message: "User Registered", user: results.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials - User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials - Password mismatch" });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are missing from environment variables");
    }

    let artist_id = null;
    if (user.role === "artist") {
      const artistQuery = await pool.query(
        "SELECT id FROM artists WHERE user_id = $1",
        [user.id],
      );

      if (artistQuery.rows.length > 0) {
        artist_id = artistQuery.rows[0].id;
      }
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
        name: user.first_name,
        artist_id: artist_id,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        const expiresAt = new Date(decoded.exp * 1000);

        await pool.query(
          "INSERT INTO blacklisted_tokens (token, expires_at) VALUES ($1, $2)",
          [token, expiresAt],
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  res.json({ message: "Logged Out" });
};
