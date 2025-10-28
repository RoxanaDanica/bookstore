import { createBooks } from '../persistance/uploadFile.js';
import { XLSX } from '../utils/xlsxUtils.js';


export const processExcelFile = async (pathToExcel) => {
    const workbook = XLSX.readFile(pathToExcel);
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        console.log(`--- Sheet: ${sheetName} ---`);
        console.log('rows', rows); 
        createBooks(rows)
    });
}