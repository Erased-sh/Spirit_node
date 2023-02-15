const D = require("./database");
const {GoogleSpreadsheet} = require("google-spreadsheet");
const cred = require("./webfitness-377103-e84645eb78d7.json");
const {tableexist} = require("./database");


module.exports={Distributer,mark_comment,getTraining}
const alphabet=["A","B","C","D","E","F","G","H","I","J","K","L"]
async function Distributer(Access,mobile,executedex,ex,val){
    Use("1G9LFJoWUq8OxOW19DCMKRwC8PHxMebIS97-4EA4Oz2M",Access,executedex.toString(),ex.toString(),val.toString())
    tab=await tableexist(mobile)
    if (Access%2==1&tab==0){

    }
}
async function Use(googletable,date,executedex,ex,val) {
    console.log(date)
    const doc = new GoogleSpreadsheet(googletable);
    doc.useServiceAccountAuth(cred);

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

   var execises = fillJSON(rows)
    i=parseInt(date, 10)
    LoadAndMark(execises,executedex,i,rows,ex,val,sheet)

}
function fillJSON(rows){
    var ex=[]
    leng=0
    rows.forEach(row => {
        if (row._rawData.length != 0) {
            leng += 1
            try {
                name = row._rawData[0].length
                if (name > 0) {
                    var training = {
                        "name": {},
                        "start": 0,
                        "end": 0
                    }
                    training['start']=leng;
                    training['name']=row._rawData;
                    training['end']=gottcha(training.start,rows)[0]
                    ex.push(training)
                }
            } catch (error) {
                console.log("Ошибка")
            }
        } else {
            leng += 1
        }
    })
    return ex
}

function gottcha(start,rows,final=rows.length){
    var end=start
    founded=[]
    for (start;start<=final;start++){
        try{
            end+=1
            row=rows[start]._rawData
            row.forEach(elem=>{
                if(elem.split(" ")[1]=="отдых"){
                    founded.push(end)
                }
            })
        }
        catch (error){

        }
    }
    return Array.from(new Set(founded));
}

function getTrainingEx(row,num,start,end, name){
    if (end==undefined){
        return name.join("|")}
    cursor=(start+num)-1
    if(cursor>end){
        return "Тренировки не существует"
    }
    k=row[cursor]._rawData
    k.pop(-1)
    k[0]=name[0]
    k[1]=row[start]._rawData[1]
    return k
}

async function Update(access){
    const doc = new GoogleSpreadsheet(googletable);
    doc.useServiceAccountAuth(cred);

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    train=execises[0]
    exmple= getTrainingEx(rows,date,train.start,train.end,train.name)
    massive=[]
    exmple.forEach(e=>{
        if(e==''){
            e='0'
        }
        massive.push(e)
    })
    D.UpdateE(massive)
    var ToBD=access+1 // И загрузить в бд
    D.UpdateProperties("date",ToBD.toString(),mobile)
    if (ToBD%2==0){
        setTimeout(Update(googletable,access),604800000 )
        //И написать в телеграм
    }
}

async function LoadAndMark(massiveJson,executedExecise,date,rows,execise,execiseValue,sheet){
    var cursor
    massiveJson.forEach(train=>{
        if (train.name[0]==executedExecise){
             cursor=train.start+date+1
            console.log("Cursorr "+cursor)
            console.log(train.start)
        }
    })
    cell=alphabet[1+parseInt(execise)]+cursor.toString()
    console.log(cell)
    updateCell(cell,sheet,execiseValue)
}
async function updateCell(cell,sheet,execiseValue){
    await sheet.loadCells(cell)
    const baseStyle = {style: "SOLID_THICK", color: {red: 1}};
    sheet.getCellByA1(cell).borders = {top: baseStyle, bottom: baseStyle, left: baseStyle, right: baseStyle};
    sheet.getCellByA1(cell).value=execiseValue.toString()
    await sheet.saveUpdatedCells()
}

async function mark_comment(executedExecise,date,Comment,googletable){
    const doc = new GoogleSpreadsheet(googletable);
    doc.useServiceAccountAuth(cred);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    var execises = fillJSON(rows)
    i=parseInt(date, 10)
    var cursor
    execises.forEach(train=>{
        if (train.name[0]==executedExecise){
            cursor=Number(train.start)+Number(date)+1
            console.log("Курсор на ячейке номер"+cursor)
        }

    })
    cell="A"+cursor.toString()
    await sheet.loadCells(cell)
    sheet.getCellByA1(cell).value=Comment.toString()
    await sheet.saveUpdatedCells()
}

async function getTraining(googletable){
    console.log("eee")
    const doc = new GoogleSpreadsheet(googletable);
    doc.useServiceAccountAuth(cred);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
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
     console.log(massive)
    return massive
    //await sheet.saveUpdatedCells()

}
async function f(){
    k=await getTraining("1G9LFJoWUq8OxOW19DCMKRwC8PHxMebIS97-4EA4Oz2M")
    console.log(k)
}

