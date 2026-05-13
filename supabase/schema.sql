-- Renamed: this is now a MySQL schema, not Supabase
-- Run this in cPanel → phpMyAdmin on database your-cpanel-username_toolsdb

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  cv_path VARCHAR(255) DEFAULT NULL,
  cv_summary TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider ENUM('gmail','outlook','yahoo') NOT NULL,
  email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
