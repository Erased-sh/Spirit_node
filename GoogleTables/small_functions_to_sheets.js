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
                    training['end']=get_end_of_training(training.start,rows)[0]
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
function get_end_of_training(start,rows,final=rows.length){
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
function get_row_of_training(row,num,start,end, name){
    console.log(name)
    if (end==undefined){
        return name.join("|")}
    cursor=(start+num)-1
    if(cursor>end){
        return "Тренировки не существует"
    }
    k=row[cursor]._rawData
    k.pop()
    k[0]=name[0]
    k[1]=row[start]._rawData[1]
     console.log(k)
    return k
}
function setExNullable(exmple){
    massive=[]
    exmple.forEach(e=>{
        if(e==''){
            e='0'
        }
        massive.push(e)
    })
    return massive
}
async function updateCell(cell,sheet){
    await sheet.loadCells(cell)
    const color = {color: {red: 1}};
    sheet.getCellByA1(cell).backgroundColor = color
    await sheet.saveUpdatedCells()
}
function get_cursor_on_Ex(JS,ex,date){
    var cursor
    JS.forEach(train=>{
        if (train.name[0]==ex){cursor=train.start+Number(date)+1}})
    return cursor
}

module.exports={fillJSON,setExNullable,get_row_of_training,updateCell,get_cursor_on_Ex}