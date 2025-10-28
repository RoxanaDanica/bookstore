import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { Readable } from 'stream';

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);
XLSX.set_cptable(cpexcel);

export { XLSX };