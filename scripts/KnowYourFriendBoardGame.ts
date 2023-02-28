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

await GetMetadata()

await WriteData(5) // Pool 0
await WriteData(6) // Pool 1
await WriteData(7) // Pool 2
await WriteData(8) // Pool 3

async function GetMetadata() {
    const sheet = doc.sheetsByIndex[3]
    const rows = await sheet.getRows({ offset: 0 })

    console.log("Metadata fetched.")
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/Metadata`, rows[0].UpdateTime)
    console.log("Metadata written to file.")
}

async function WriteData(sheetIndex: number) {
    const sheet = doc.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows({ offset: 1 })

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

    console.log(`${data.length} rows fetched. Writing ${sheet.title} to file...`)
    
    let temp: string = ""
    //EN
    for (const row of data) temp += row.englishText + (row == data[data.length-1] ? "" : "\n")
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_EN`, temp)
    //TH
    temp = ""
    for (const row of data) temp += row.thaiText + (row == data[data.length-1] ? "" : "\n")
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_TH`, temp)
    //JP
    temp = ""
    for (const row of data) temp += row.japaneseText + (row == data[data.length-1] ? "" : "\n")
    fs.writeFileSync(`./data/KnowYourFriendBoardgame/${sheet.title}_JP`, temp)

    console.log(`Done written ${sheet.title} to file.`)
} 
    