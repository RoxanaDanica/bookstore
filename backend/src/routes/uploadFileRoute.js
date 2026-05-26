import express from 'express';
import multer from 'multer';
import { processExcelFile } from '../services/uploadFileService.js';

const uploadFileRouter = express.Router();
const upload = multer({dest: './temp/uploads/'});


// uploadFileRouter.post('/',  upload.single('file'), async(req, res) => {
//         const file = req.file;
//         const pathToDowndloadedFile = file.destination + file.filename;
//         processExcelFile(pathToDowndloadedFile);
//         res.send(200);
// });

uploadFileRouter.post('/', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const pathToDownloadedFile = file.destination + file.filename;

        await processExcelFile(pathToDownloadedFile);

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

export default uploadFileRouter;
