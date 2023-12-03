import fs from 'fs';

export function getFilesizeInBytes(filename: string) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}