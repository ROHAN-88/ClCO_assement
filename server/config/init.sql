CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('m', 'f', 'o')),
    address VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('super_admin', 'artist_manager', 'artist')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    gender VARCHAR(10) CHECK (gender IN ('m', 'f', 'o')),
    address VARCHAR(255),
    first_release_year INT,
    no_of_albums_released INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS music (
    id SERIAL PRIMARY KEY,
    artist_id INT REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    genre VARCHAR(20) CHECK (genre IN ('rnb', 'country', 'classic', 'rock', 'jazz')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);