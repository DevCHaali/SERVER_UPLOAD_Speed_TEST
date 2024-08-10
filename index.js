const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
numPOST_request= 0
const app = express();
app.use(cors()); // Enable CORS for all routes

// Directory where files will be uploaded
const UPLOAD_FOLDER = 'uploads';

// Create the upload folder if it doesn't exist
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 16 * 1024 * 1024 }, // 16 MB limit
    fileFilter: function (req, file, cb) {
        const allowedExtensions = /png|jpg|jpeg|gif|pdf|py|mp4|mp3|pdf|exe|apk|js|bat|zip|rar|json|7z/;
        const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedExtensions.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
}).single('file');

app.get('/', (req, res) => {
    res.send("<h1> Hello, this is API web for test upload.</h1>");
});

app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        if (!req.file) {
            return res.status(400).send('No file selected');
        }
        res.send('File uploaded successfully');
        numPOST_request++; 
	    console.log("Nomber Request : "+numPOST_request);
	    
    });
});

// Set the port dynamically from an environment variable or use 5000 as the default
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
