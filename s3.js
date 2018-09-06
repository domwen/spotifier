const knox = require('knox');
const fs = require('fs');
let s3Bucket = require('./config.json');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets.json'); // secrets.json is in .gitignore
}

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'first-class-bucket'
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log('No req.file');
        return res.status(500).json({
            success: false
        });
    }
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', s3Response => {
        if (s3Response.statusCode == 200) {
            next();
        } else {
            console.log(s3Response.statusCode);
            res.status(500).json({
                success: false
            });
        }
    });
};
