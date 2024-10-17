-- Drop existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS pokemons CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(100),
    password VARCHAR(255) NOT NULL,
	exp INTEGER DEFAULT 0,
	wallet INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pokemon table
CREATE TABLE pokemon (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table to establish the many-to-many relationship between users and pokemon
CREATE TABLE likes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, pokemon_id)
);

CREATE TABLE friends (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id <> friend_id)  -- Prevents users from being friends with themselves
);

-- Insert some example data
INSERT INTO users (username, email, password)
VALUES ('dog', 'dog@test.com', '123');

-- INSERT INTO pokemons (name, type, user_id)
-- VALUES ('Pikachu', 'Electric', 1),
--        ('Charmander', 'Fire', 1);
