import { GoogleSpreadsheet } from "google-spreadsheet";
import 'dotenv/config';
import fs from "fs";
const doc = new GoogleSpreadsheet(process.env.KYFBG_SHEETID);
await doc.useServiceAccountAuth({
    client_email: process.env.SERVICE_EMAIL,
    private_key: process.env.PRIVATE_KEY,
});
await doc.loadInfo();
await GetMetadata();
await WriteData(5);
await WriteData(6);
await WriteData(7);
await WriteData(8);
async function GetMetadata() {
    console.log("KYFBG[Metadata]: fetching.");
    const sheet = doc.sheetsByIndex[3];
    const rows = await sheet.getRows({ offset: 0 });
    console.log("KYFBG[Metadata]: fetched. Version: " + rows[0].UpdateTime);
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/Metadata`, rows[0].UpdateTime);
    console.log("KYFBG[Metadata]: written to file.");
}
async function WriteData(sheetIndex) {
    const sheet = doc.sheetsByIndex[sheetIndex];
    const rows = await sheet.getRows({ offset: 1 });
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
    console.log(`KYFBG[Pool ${sheet.title}]: ${data.length} rows fetched.`);
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}.json`, JSON.stringify(data));
    console.log(`KYFBG[Pool ${sheet.title}]: written to file`);
}
