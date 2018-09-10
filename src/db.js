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
