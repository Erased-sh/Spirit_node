const {GoogleSpreadsheet} = require("google-spreadsheet");
const cred = require("../webfitness-377103-e84645eb78d7.json");
const s_f_t_s = require("./small_functions_to_sheets")
const D = require("../additional/database");
const telegram = require("../additional/telegram")
const {get_row_of_training} = require("./small_functions_to_sheets");
const {reload_all} = require("../additional/database");
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]


async function Distributer(date, mobile, executedex, ex, val, google_sheets, comm, url) {
    LoadAndMark(executedex, date, ex, val, google_sheets, comm, url)
}

async function Connector_to_Google(googletable) {
    const doc = new GoogleSpreadsheet(googletable);
    doc.useServiceAccountAuth(cred);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    var info_about_trainings = s_f_t_s.fillJSON(rows)

    const Google_Standart_Func = {
        "doc": doc,
        "sheet": sheet,
        "rows": rows,
        "JSON": info_about_trainings,
    }
    return Google_Standart_Func
}

async function Reload_Table_When_It_Is_Finished(date, googletable, mobile) {
    google_api = await Connector_to_Google(googletable)
    one_ex= google_api["JSON"]
    sh = google_api["sheet"]
    AllExInfo=await s_f_t_s.get_all_execises(google_api["rows"], date, one_ex , googletable,sh)
    pl=AllExInfo[1]
    if (pl.length!=0){
        await reload_all(mobile,AllExInfo[0],pl)
    }
    else{
    await reload_all(mobile,AllExInfo[0])
    console.log("Наконец-то блять")}

    // telegram.training_is_ready(await D.select_chat_id(mobile))
}

async function LoadAndMark(executedExecise, date, execise, execiseValue, google_sheets, commentere, url) {
    GoogleApi = await Connector_to_Google(google_sheets)
    cursor = s_f_t_s.get_cursor_on_Ex(GoogleApi["JSON"], executedExecise, date)
    console.log("Color is " + execiseValue)
    s_f_t_s.updateCell(alphabet[1 + parseInt(execise)] + cursor.toString(), GoogleApi["sheet"], commentere, execiseValue, url)
}

async function mark_comment(executedExecise, date, Comment, googletable, number, newVal) {
    Google_Api = await Connector_to_Google(googletable)
    sheet = Google_Api["sheet"]
    console.log(executedExecise)
    const cursor = s_f_t_s.get_cursor_on_Ex(Google_Api["JSON"], executedExecise, date)
    cell = alphabet[1 + Number(number)] + cursor.toString()
    await sheet.loadCells(cell)
    if (newVal != null) {
        sheet.getCellByA1(cell).value = newVal.toString()
    }
    if (Comment != "") {
        sheet.getCellByA1(cell).note = "U: " + Comment.toString()
    }
    await sheet.saveUpdatedCells()
}

async function mark_ex(executedExecise, date, googletable, number, newVal) {
    const listOfColors = [
        {color: {red: 139 / 255, green: 26 / 255, blue: 16 / 255, alpha: 0}},
        {color: {red: 234 / 255, green: 51 / 255, blue: 35 / 255, alpha: 0}},
        {color: {red: 241 / 255, green: 158 / 255, blue: 56 / 255, alpha: 0}},
        {color: {red: 255 / 255, green: 255 / 255, blue: 84 / 255, alpha: 0}},
        {color: {red: 117 / 255, green: 251 / 255, blue: 76 / 255, alpha: 0}},
        {color: {red: 117 / 255, green: 251 / 255, blue: 253 / 255, alpha: 0}},
        {color: {red: 234 / 255, green: 51 / 255, blue: 247 / 255, alpha: 0}},
    ]
    const listOfUserColors = {
        "0": listOfColors[0].color,
        "1": listOfColors[2].color,
        "2": listOfColors[3].color,
        "3": listOfColors[4].color,
        "+": listOfColors[5].color
    }
    Google_Api = await Connector_to_Google(googletable)
    sheet = Google_Api["sheet"]
    const cursor = s_f_t_s.get_cursor_on_Ex(Google_Api["JSON"], executedExecise, date)
    cell = alphabet[1 + Number(number)] + cursor.toString()
    await sheet.loadCells(cell)
    sheet.getCellByA1(cell)["backgroundColor"] = listOfUserColors[newVal]
    await sheet.saveUpdatedCells()
}

async function get_prim_training(googletable, mobile) {
    google_api = await Connector_to_Google(googletable)
    sheet = google_api["sheet"]
    rows = google_api["rows"]
    if (await D.tableexist(mobile) == 0) {
        D.UpdateProperties("date",Number(await D.geDate(mobile))+1,mobile)
        await Reload_Table_When_It_Is_Finished(await D.geDate(mobile), googletable, mobile)
        console.log("Получить полную тренировку")
        interv = rows[0]._sheet.headerValues[0].toString()
        massive = []
        sec = rows[0]._sheet.headerValues[1].toString()
        await sheet.loadCells(interv)
        await sheet.loadCells(sec)
        cell1 = sheet.getCellByA1(interv).value
        massive.push(cell1)
        cell2 = sheet.getCellByA1(sec).value
        massive.push(cell2)
        return massive
       }
    else {
        interv = rows[0]._sheet.headerValues[0].toString()
        sec = rows[0]._sheet.headerValues[1].toString()
        await sheet.loadCells(interv)
        massive = []
        await sheet.loadCells(sec)
        cell1 = sheet.getCellByA1(interv).value
        massive.push(cell1)
        cell2 = sheet.getCellByA1(sec).value
        massive.push(cell2)
        return massive

    }
    return massive
}

//Reload_Table_When_It_Is_Finished(3,"1G9LFJoWUq8OxOW19DCMKRwC8PHxMebIS97-4EA4Oz2M","79164009726")

async function rel_table(google_sheets, mobile) {
    dat = Number(await D.geDate(mobile))
    if (Number(dat) % 2 == 1 & await D.tableexist(mobile) == 0) {
        Reload_Table_When_It_Is_Finished(dat, google_sheets, mobile)
    }

}

module.exports = {Distributer, mark_comment, get_prim_training, mark_ex, Connector_to_Google}