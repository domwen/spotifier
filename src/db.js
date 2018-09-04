const spicedPg = require('spiced-pg');
const { pgUser, pgPw } = require('.././secrets.json');

var dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${pgUser}:${pgPw}@localhost:5432/socialnetwork`;

const db = spicedPg(dbUrl);

module.exports.saveUser = params => {
    const q =
        'INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING first,last,id';
    return db.query(q, params);
};

module.exports.getPassword = params => {
    const q = 'SELECT password, first, last, id FROM users WHERE email = $1';
    return db.query(q, [params]);
};
