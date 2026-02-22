const { pool } = require("../config/db");
const csv = require("fast-csv");
const fs = require("fs");
const bcrypt = require("bcryptjs");

exports.getArtists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM artists ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    const countResult = await pool.query("SELECT COUNT(*) FROM artists");

    res.json({
      data: result.rows,
      pagination: {
        totalItems: parseInt(countResult.rows[0].count),
        currentPage: page,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createArtist = async (req, res) => {
  const {
    name,
    email,
    password,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const userQuery = `
      INSERT INTO users (first_name, last_name, email, password, phone, dob, gender, address, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Artist";

    const userResult = await client.query(userQuery, [
      firstName,
      lastName,
      email,
      hashedPassword,
      "0000000000",
      dob,
      gender,
      address,
      "artist",
    ]);

    const userId = userResult.rows[0].id;

    const artistQuery = `
      INSERT INTO artists (user_id, name, dob, gender, address, first_release_year, no_of_albums_released)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const result = await client.query(artistQuery, [
      userId,
      name,
      dob,
      gender,
      address,
      first_release_year,
      no_of_albums_released,
    ]);

    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email address already in use." });
    }
    res.status(500).json({ error: "Failed to create artist: " + err.message });
  } finally {
    client.release();
  }
};

exports.updateArtist = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE artists 
             SET name = $1, dob = $2, gender = $3, address = $4, first_release_year = $5, no_of_albums_released = $6, updated_at = NOW()
             WHERE id = $7 RETURNING *`,
      [
        name,
        dob,
        gender,
        address,
        first_release_year,
        no_of_albums_released,
        id,
      ],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Artist not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM artists WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Artist not found" });
    res.json({ message: "Artist deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.importCSV = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileRows = [];
  fs.createReadStream(req.file.path)
    .pipe(csv.parse({ headers: true }))
    .on("data", (row) => fileRows.push(row))
    .on("end", async () => {
      fs.unlinkSync(req.file.path);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const row of fileRows) {
          await client.query(
            `INSERT INTO artists (name, dob, gender, address, first_release_year, no_of_albums_released) 
                         VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              row.name,
              row.dob,
              row.gender,
              row.address,
              row.first_release_year,
              row.no_of_albums_released,
            ],
          );
        }
        await client.query("COMMIT");
        res.json({
          message: "CSV Imported Successfully",
          rowsInserted: fileRows.length,
        });
      } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).json({
          error: "Import failed, transaction rolled back. " + err.message,
        });
      } finally {
        client.release();
      }
    });
};

exports.exportCSV = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, dob, gender, address, first_release_year, no_of_albums_released FROM artists",
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="artists_export.csv"',
    );

    csv.write(result.rows, { headers: true }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
