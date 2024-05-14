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

CREATE TABLE tags(
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    color CHAR(6) NOT NULL
);

CREATE TABLE gruppen(
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL,
    tag_id INT NOT NULL,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE members_in_gruppen (
    user_id INT not Null,
    gruppen_id INT not Null,
    PRIMARY KEY (user_id, gruppen_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (gruppen_id) REFERENCES gruppen(id)
);

Create Table expenses (
    id INT NOT NULL AUTO_INCREMENT,
    group_id INT not Null,
    bezahlt_von INT not null,
    title VARCHAR(255) not Null,
    amount decimal(12,2) not Null,
    datum date not null,
    picture varchar(255) not Null,
    PRIMARY key (id)
    FOREIGN KEY (bezahlt_von) REFERENCES users(id),
    FOREIGN KEY (gruppen_id) REFERENCES gruppen(id)
)
CREATE TABLE bezahlt_fuer (
    expense INT NOT NULL,
    member INT NOT NULL,
    PRIMARY KEY (expense, member),
    FOREIGN KEY (expense) REFERENCES expenses(id),
    FOREIGN KEY (member) REFERENCES users(id)
);
