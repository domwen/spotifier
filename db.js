const spicedPg = require('spiced-pg');
const { pgUser, pgPw } = require('./secrets.json');

var dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${pgUser}:${pgPw}@localhost:5432/spotifier`;

const db = spicedPg(dbUrl);


exports.addTrackQuery = (userId, query) => {
    const q = `
    INSERT INTO queries (user_id, query)
    VALUES ($1, $2)
    RETURNING query, user_id, id`;
    return db.query(q, [userId, query]);
};


exports.receiveTrackQueries = (userId) => {
    const q = `
      SELECT query, id, user_id
      FROM queries
      WHERE user_id = $1
      ORDER BY id DESC
      `;
    return db.query(q, [userId]);
};


exports.receiveAllTrackQueries = () => {
    const q = `
      SELECT queries.query, queries.id, queries.user_id, users.email
      FROM queries
      JOIN users
      ON user_id = users.id
      ORDER BY id DESC
      `;
    return db.query(q);
};





module.exports.saveFilteredResultsInDb = (trackId, trackTitle, imageUrl, artistNames, externalUrl, queryId, userIdFromResp) => {
    const q = `
    INSERT INTO results (spotify_id, track_title, album_image_url, artist_name, external_url, query_id, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7) ON
    CONFLICT DO NOTHING
    `;


    return db.query(q, [trackId, trackTitle, imageUrl, artistNames, externalUrl, queryId, userIdFromResp]);
};


// WHERE (spotify_id != $1 AND user_id != $7 AND query_id != $6)

module.exports.saveUser = params => {
    const q =
        'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query(q, params);
};

module.exports.getPassword = params => {
    const q =
        'SELECT password, first_name, last_name, id, profile_pic_url FROM users WHERE email = $1';
    return db.query(q, [params]);
};

// module.exports.saveBio = (bio, id) => {
//     const q = `UPDATE users
//     SET bio = $1
//     WHERE id = $2`;
//     return db.query(q, [bio, id]);
// };

module.exports.getUserInfo = params => {
    const q = `SELECT first_name, last_name, id, profile_pic_url FROM users WHERE id = $1`;
    return db.query(q, [params]);
};

module.exports.updateImage = (image_url, id) => {
    const q = `
    UPDATE users
    SET profile_pic_url = $1
    WHERE id = $2
    RETURNING profile_pic_url
    `;
    return db.query(q, [image_url, id]);
};

// exports.otherProfile = id => {
//     const q = `
//     SELECT first_name, last_name, id, bio, profile_pic_url
//     FROM users
//     WHERE id = $1
//     `;
//     return db.query(q, [id]);
// };





exports.deleteFriendRequest = (receiver_id, sender_id) => {
    const q = `
    DELETE FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)
    `;
    return db.query(q, [receiver_id, sender_id]);
};



exports.getUsersByIds = arrayOfIds => {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};



exports.addMessage = (userId, message, profile_pic_url) => {
    const q = `INSERT INTO messages (sender_id, message, image_url)
    VALUES ($1, $2, $3)
    RETURNING id as chatid, sender_id, created_at, message, image_url`;
    return db.query(q, [userId, message, profile_pic_url]);
};
