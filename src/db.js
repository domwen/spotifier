const spicedPg = require('spiced-pg');
const { pgUser, pgPw } = require('.././secrets.json');

var dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${pgUser}:${pgPw}@localhost:5432/socialnetwork`;

const db = spicedPg(dbUrl);

module.exports.saveUser = params => {
    const q =
        'INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query(q, params);
};

module.exports.getPassword = params => {
    const q =
        'SELECT password, first, last, id, url FROM users WHERE email = $1';
    return db.query(q, [params]);
};

module.exports.saveBio = (bio, id) => {
    const q = `UPDATE users
    SET bio = $1
    WHERE id = $2`;
    return db.query(q, [bio, id]);
};

module.exports.getUserInfo = params => {
    const q = `SELECT first, last, id, bio, url FROM users WHERE id = $1`;
    return db.query(q, [params]);
};

module.exports.updateImage = (image_url, id) => {
    const q = `
    UPDATE users
    SET url = $1
    WHERE id = $2
    RETURNING url
    `;
    return db.query(q, [image_url, id]);
};

exports.otherProfile = id => {
    const q = `
    SELECT first, last, id, bio, url
    FROM users
    WHERE id = $1
    `;
    return db.query(q, [id]);
};

exports.getFriendshipStatus = (ownId, otherId) => {
    const q = `SELECT sender_id, receiver_id, status FROM friendships WHERE
    (sender_id = $1 AND receiver_id =$2)
    OR
    (sender_id = $2 AND receiver_id = $1)`;
    return db.query(q, [ownId, otherId]);
};

exports.newFriendRequest = (friendshipStatus, sender_id, receiver_id) => {
    const q = `
    INSERT INTO friendships (status, sender_id, receiver_id)
    VALUES ($1, $2, $3)
    RETURNING status`;
    return db.query(q, [friendshipStatus, sender_id, receiver_id]);
};

exports.updateFriendRequest = (friendshipStatus, sender_id, receiver_id) => {
    const q = `
    UPDATE friendships
    SET status = $1
    WHERE (sender_id = $2 AND receiver_id = $3)
    OR
    (sender_id = $3 AND receiver_id = $2)
    RETURNING status`;
    return db.query(q, [friendshipStatus, sender_id, receiver_id]);
};

exports.deleteFriendRequest = (receiver_id, sender_id) => {
    const q = ` 
    DELETE FROM friendships 
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)
    `;
    return db.query(q, [receiver_id, sender_id]);
};
