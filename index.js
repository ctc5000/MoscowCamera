const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Мультипарт парсер для обработки файлов
const upload = multer({ dest: 'uploads/' });

// Обработка POST запроса на /uploadSnapshot
app.post('/uploadSnapshot', upload.single('snapshot'), function(req, res) {
    const tempPath = req.file.path;
    const targetPath = 'uploads/snapshot_' + Date.now() + '.png';

    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

            res
                .status(200)
                .header('Access-Control-Allow-Origin', '*') // Разрешаем доступ с любого источника
                .contentType("text/plain")
                .end('File uploaded!');
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res
                .status(403)
                .contentType("text/plain")
                .end('Only .png files are allowed!');
        });
    }
});

function handleError(err, res) {
    console.error(err);
    res
        .status(500)
        .contentType("text/plain")
        .end('Internal Server Error');
}

app.listen(3001, function() {
    console.log('Server is running on port 3000');
});