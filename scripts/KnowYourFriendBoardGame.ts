import { GoogleSpreadsheet } from "google-spreadsheet"
import 'dotenv/config'
import fs from "fs"

type KnowYourFriendBoardgameQuestion = {
    englishText: string,
    thaiText: string,
    japaneseText: string,
}


const doc: GoogleSpreadsheet = new GoogleSpreadsheet(process.env.KYFBG_SHEETID)
await doc.useServiceAccountAuth({
    client_email: process.env.SERVICE_EMAIL,
    private_key: process.env.PRIVATE_KEY,
});
await doc.loadInfo()

await WriteData(4) // Pool 0
await WriteData(5) // Pool 1
await WriteData(6) // Pool 2
await WriteData(7) // Pool 3

async function WriteData(sheetIndex: number) {
    const sheet = doc.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows({ offset: 2 })

    const data: KnowYourFriendBoardgameQuestion[] = []
    for (let i=0; i<rows.length; i++) {
        const row = rows[i]
        const englishText = row.englishText
        const thaiText = row.thaiText
        const japaneseText = row.japaneseText
        const temp: KnowYourFriendBoardgameQuestion = {
            englishText,
            thaiText,
            japaneseText,
        }
        data.push(temp)
    }
    
    let temp: string
    //EN
    for (const row of data) temp += row.englishText + "\n"
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_EN.txt`, temp)
    //TH
    for (const row of data) temp += row.thaiText + "\n"
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_TH.txt`, temp)
    //JP
    for (const row of data) temp += row.japaneseText + "\n"
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_JP.txt`, temp)
} 
    