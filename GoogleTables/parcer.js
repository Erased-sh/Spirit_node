const {GoogleSpreadsheet} = require("google-spreadsheet");
const cred = require("../webfitness-377103-e84645eb78d7.json");
const s_f_t_s=require("./small_functions_to_sheets")
const D = require("../additional/database");
const telegram=require("../additional/telegram")
const alphabet=["A","B","C","D","E","F","G","H","I","J","K","L"]


async function Distributer(date,mobile,executedex,ex,val,google_sheets){//!!!gogole
    if (Number(date)%2==1&await D.tableexist(mobile)==0){
        Reload_Table_When_It_Is_Finished(date,google_sheets,mobile)
    }

    LoadAndMark(executedex,date,ex,val,google_sheets)
}
async function Connector_to_Google(googletable) {
    const doc = new GoogleSpreadsheet(googletable);
    doc.useServiceAccountAuth(cred);

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    var info_about_trainings = s_f_t_s.fillJSON(rows)

    const Google_Standart_Func={
        "doc":doc,
        "sheet":sheet,
        "rows":rows,
        "JSON":info_about_trainings,
    }
    return Google_Standart_Func
}
async function Reload_Table_When_It_Is_Finished(date,googletable,mobile){
    google_api=await Connector_to_Google(googletable)
    one_ex=google_api["JSON"][0]
    one_exercise_from_date_row= s_f_t_s.get_row_of_training(google_api["rows"],date,one_ex["start"],one_ex["end"],one_ex["name"])
    k=one_exercise_from_date_row
    k.shift()
    k.shift()
    console.log(k)
    all_execises=s_f_t_s.setExNullable(k)
    D.UpdateE(all_execises) //!возможно insert
    telegram.training_is_ready()
    D.UpdateProperties("date",Number(date+1).toString(),mobile)
    if (Number(date+1)%2==0){
        setTimeout(Reload_Table_When_It_Is_Finished(D.geDate(mobile), googletable,mobile),604800000 )
    }
}
async function LoadAndMark(executedExecise,date,execise,execiseValue,google_sheets){
    GoogleApi=Connector_to_Google(google_sheets)
    s_f_t_s.get_cursor_on_Ex(GoogleApi["JSON"],execise,date)
    s_f_t_s.updateCell(alphabet[1+parseInt(execise)]+cursor.toString(),GoogleApi["sheet"])
}
async function mark_comment(executedExecise,date,Comment,googletable){
    Google_Api=Connector_to_Google(googletable)
    sheet=Google_Api[sheet]
    const cursor=s_f_t_s.get_cursor_on_Ex(Google_Api["JSON",executedExecise,date])
    cell="A"+cursor.toString()
    await sheet.loadCells(cell)
    sheet.getCellByA1(cell).value=Comment.toString()
    await sheet.saveUpdatedCells()
}
async function get_prim_training(googletable){
    console.log("Получить полную тренировку")
    google_api=Connector_to_Google(googletable)
    sheet=google_api["sheet"]
    interv=rows[0]._sheet.headerValues[0]
    Letter=interv[0]
    prim=Number(interv.slice(1))
    sec=Number(rows[0]._sheet.headerValues[1].slice(1))
    massive=[]
     for (i=prim;i<=sec;i++){
        cell=Letter+i.toString()
        await sheet.loadCells(cell)
        cell_val=sheet.getCellByA1(cell).value
        massive.push(cell_val)
    }
    return massive
}
Reload_Table_When_It_Is_Finished(3,"1G9LFJoWUq8OxOW19DCMKRwC8PHxMebIS97-4EA4Oz2M","79164009726")

module.exports={Distributer,mark_comment,get_prim_training}