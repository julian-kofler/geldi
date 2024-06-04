CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    profilePicPath VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS password_resets(
    id INT PRIMARY KEY NOT NULL,
    token VARCHAR(255) NOT NULL,
    expirationTime TIMESTAMP NOT NULL,
    CONSTRAINT fk_pwUserId FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags(
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    color CHAR(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS `groups`(
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN
);

CREATE TABLE IF NOT EXISTS members_in_groups (
    userId INT NOT NULL,
    groupId INT NOT NULL,
    CONSTRAINT pk_membersInGroups PRIMARY KEY (userId, groupId),
    CONSTRAINT fk_membersUserID FOREIGN KEY (userId) REFERENCES users(id),
    CONSTRAINT fk_groupID FOREIGN KEY (groupId) REFERENCES `groups`(id)
);

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    groupId INT NOT NULL,
    payedBy INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    `timestamp` TIMESTAMP NOT NULL,
    tag_id INT,
    picPath VARCHAR(255),
    CONSTRAINT fk_payedBy FOREIGN KEY (payedBy) REFERENCES users(id),
    CONSTRAINT fk_group FOREIGN KEY (groupId) REFERENCES `groups`(id),
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS payed_for (
    expenseID INT NOT NULL,
    userID INT NOT NULL,
    CONSTRAINT pk_payedFor PRIMARY KEY (expenseID, userID),
    CONSTRAINT fk_expenseID FOREIGN KEY (expenseID) REFERENCES expenses(id),
    CONSTRAINT fk_payedForUserID FOREIGN KEY (userID) REFERENCES users(id)
);
