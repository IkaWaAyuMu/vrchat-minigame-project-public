import { GoogleSpreadsheet } from "google-spreadsheet";
import 'dotenv/config';
import fs from "fs";
const doc = new GoogleSpreadsheet(process.env.NHIE_SHEETID);
await doc.useServiceAccountAuth({
    client_email: process.env.SERVICE_EMAIL,
    private_key: process.env.PRIVATE_KEY,
});
await doc.loadInfo();
await GetMetadata();
await WriteData(4);
await WriteData(5);
async function GetMetadata() {
    const sheet = doc.sheetsByIndex[2];
    const rows = await sheet.getRows({ offset: 0 });
    console.log("NHIE[Metadata]: fetched. Version: " + rows[0].UpdateTime);
    fs.writeFileSync(`./data/NeverHaveIEver/Metadata`, rows[0].UpdateTime);
    console.log("NHIE[Metadata]: written to file.");
}
async function WriteData(sheetIndex) {
    const sheet = doc.sheetsByIndex[sheetIndex];
    const rows = await sheet.getRows({ offset: 0 });
    const data = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const englishText = row.englishText;
        const thaiText = row.thaiText;
        const japaneseText = row.japaneseText;
        const temp = {
            englishText,
            thaiText,
            japaneseText,
        };
        data.push(temp);
    }
    console.log(`NHIE[Pool ${sheet.title}]: ${data.length} rows fetched.`);
    fs.writeFileSync(`./data/NeverHaveIEver/${sheet.title}.json`, JSON.stringify(data));
    console.log(`Done written ${sheet.title} to file.`);
}
