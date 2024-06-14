const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({limit: '10mb', type: 'image/png'}));
// Мультипарт парсер для обработки файлов
const upload = multer({ dest: 'uploads/' });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Обработка POST запроса на /uploadSnapshot
app.post('/uploadSnapshot', upload.single('snapshot'), (req, res) => {
    if (!req.body.snapshot) {
        return handleError('No snapshot data found', res);
    }

    const timestamp = Date.now();
    const fileName = `snapshot_${timestamp}_${uuidv4()}.png`;
    const filePath = path.join(__dirname, 'uploads', 'preview', fileName);

    // Удаление заголовка "data:image/png;base64," перед сохранением
    const base64Data = req.body.snapshot.replace(/^data:image\/png;base64,/, '');

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return handleError(err, res);
        }
        console.log('Snapshot saved:', fileName);
        res.send('Snapshot saved');
    });
});
function handleError(err, res) {
    console.error(err);
    res
        .status(500)
        .contentType("text/plain")
        .end('Internal Server Error');
}
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})