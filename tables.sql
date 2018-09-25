
CREATE TABLE users (
    id SERIAL primary key,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    profile_pic_url VARCHAR(500)
);


CREATE TABLE  queries(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    query  VARCHAR(500) NOT NULL,
    found_status INTEGER NOT NULL DEFAULT 1,
    -- this is set by user: Values: 0 = not found, 1 = found
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notification_id INTEGER REFERENCES notifications(id)
);



CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    query_id INTEGER NOT NULL REFERENCES queries(id),
    artist_name VARCHAR(200),
    track_title VARCHAR(200),
    external_url VARCHAR(200),
    spotify_id VARCHAR(200),
    album_image_url VARCHAR(200),
    match_status INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE notifications(
id SERIAL PRIMARY KEY,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
