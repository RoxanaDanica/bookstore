import express from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { Readable } from 'stream';
import { addBooks } from '../services/uploadFileService.js';

const upload = multer({dest: './temp/uploads/'});
const uploadFileRouter = express.Router();
XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);
XLSX.set_cptable(cpexcel);

uploadFileRouter.post('/',  upload.single('file'), async(req, res) => {
        const file = req.file;
        const pathToDowndloadedFile = file.destination + file.filename;
        const workbook = XLSX.readFile(pathToDowndloadedFile);
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });

            console.log(`--- Sheet: ${sheetName} ---`);
            console.log(rows); 
        });
});

export default uploadFileRouter;
