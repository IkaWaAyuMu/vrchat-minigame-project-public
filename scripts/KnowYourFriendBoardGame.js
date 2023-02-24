import { GoogleSpreadsheet } from "google-spreadsheet";
import 'dotenv/config';
import fs from "fs";
const doc = new GoogleSpreadsheet(process.env.KYFBG_SHEETID);
await doc.useServiceAccountAuth({
    client_email: process.env.SERVICE_EMAIL,
    private_key: process.env.PRIVATE_KEY,
});
await doc.loadInfo();
await WriteData(4);
await WriteData(5);
await WriteData(6);
await WriteData(7);
async function WriteData(sheetIndex) {
    const sheet = doc.sheetsByIndex[sheetIndex];
    const rows = await sheet.getRows({ offset: 2 });
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
    let temp;
    for (const row of data)
        temp += row.englishText + "\n";
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_EN.txt`, temp);
    for (const row of data)
        temp += row.thaiText + "\n";
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_TH.txt`, temp);
    for (const row of data)
        temp += row.japaneseText + "\n";
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_JP.txt`, temp);
}