const { pool } = require("../config/db");

exports.getMusicByArtist = async (req, res) => {
  const { artist_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM music WHERE artist_id = $1 ORDER BY id DESC",
      [artist_id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMusic = async (req, res) => {
  const { artist_id, title, album_name, genre } = req.body;
  try {
    const artistCheck = await pool.query(
      "SELECT id FROM artists WHERE id = $1 AND user_id = $2",
      [artist_id, req.user.id],
    );
    if (artistCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You can only add music to your own profile" });
    }

    const result = await pool.query(
      `INSERT INTO music (artist_id, title, album_name, genre) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
      [artist_id, title, album_name, genre],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMusic = async (req, res) => {
  const { id } = req.params;
  const { title, album_name, genre } = req.body;
  try {
    const result = await pool.query(
      `UPDATE music 
             SET title = $1, album_name = $2, genre = $3, updated_at = NOW() 
             WHERE id = $4 RETURNING *`,
      [title, album_name, genre, id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Song not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMusic = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM music WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Song not found" });
    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
