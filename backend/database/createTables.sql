CREATE TABLE users (
    id INT(7) AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    profilePicPath VARCHAR(255)
);

CREATE TABLE password_resets(
    id INT PRIMARY KEY NOT NULL,
    token VARCHAR(255) NOT NULL,
    expirationTime TIMESTAMP NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (id) REFERENCES users(id)
);