const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at FROM users ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalItems = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Database Error in getUsers:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (first_name, last_name, email, password, phone, dob, gender, address, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, role`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        dob,
        gender,
        address,
        role,
      ],
    );

    const newUser = userResult.rows[0];

    if (role === "artist") {
      const artistName = `${first_name} ${last_name}`.trim();
      await client.query(
        `INSERT INTO artists (user_id, name, dob, gender, address, first_release_year, no_of_albums_released)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [newUser.id, artistName, dob, gender, address, null, 0],
      );
    }

    await client.query("COMMIT");
    res.status(201).json(newUser);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, dob, gender, address, role } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users 
             SET first_name = $1, last_name = $2, phone = $3, dob = $4, gender = $5, address = $6, role = $7, updated_at = NOW() 
             WHERE id = $8 RETURNING id, email, role`,
      [first_name, last_name, phone, dob, gender, address, role, id],
    );
    if (result.rowCount === 0)
      return res.status(400).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
