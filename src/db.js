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

exports.receiveFriends = userId => {
    const q = `
        SELECT users.id, first, last, url, status
        FROM friendships
        JOIN users
        ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
        OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)`;
    return db.query(q, [userId]);
};

exports.getUsersByIds = arrayOfIds => {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

exports.getRecentMessages = () => {
    const q = `
      SELECT users.id, users.first, users.last, users.url, messages.id as chatid, messages.sender_id, messages.message, messages.created_at
      FROM messages
      LEFT JOIN users
      ON users.id = sender_id
      ORDER BY chatid DESC
      LIMIT 10
      `;
    return db.query(q);
};

exports.addMessage = (userId, message, url) => {
    const q = `INSERT INTO messages (sender_id, message, image_url)"
    VALUES ($1, $2, $3)
    RETURNING id as chatid, sender_id, created_at, message, image_url`;
    return db.query(q, [userId, message, url]);
};
