import express from 'express';
import multer from 'multer';
import { processExcelFile } from '../services/uploadFileService.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const uploadFileRouter = express.Router();
const upload = multer({dest: './temp/uploads/'});

uploadFileRouter.post('/', adminMiddleware, upload.single('file'), async (req, res) => {
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
