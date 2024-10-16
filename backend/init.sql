-- Create the database
CREATE DATABASE pokemon_db;

-- Connect to the database
\c pokemon_db;

-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the favorites table
CREATE TABLE favorites (
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    PRIMARY KEY (user_id, pokemon_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert fake users
INSERT INTO users (username, password_hash) VALUES 
('trainer1', 'hashed_password1'),
('trainer2', 'hashed_password2');

-- Insert fake favorites for users (example PokeAPI IDs)
INSERT INTO favorites (user_id, pokemon_id) VALUES 
(1, 1), -- trainer1 favorites Bulbasaur (PokeAPI ID 1)
(1, 4), -- trainer1 favorites Charmander (PokeAPI ID 4)
(2, 7); -- trainer2 favorites Squirtle (PokeAPI ID 7)
