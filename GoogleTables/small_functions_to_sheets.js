const parc=require("./parcer")
function fillJSON(rows){
    console.log(rows[0]._rawData[3])
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
    return founded;
}
async function get_row_of_training(row,num,start,end, name,google,sheet){
    const alphabet=["A","B","C","D","E","F","G","H","I","J","K","L"]
    var i=2
    finished=false
    if (end==undefined){
        return name.join("|")}
    cursor=(Number(start)+Number(num))-1
    if(cursor>end){
        return "Тренировки не существует"
    }
    k=row[cursor]._rawData
    k.pop(k.length-1)
    k.shift()
    final_massive=[]
    final_massive.push("'"+name.toString()+"' ")
    final_massive.push(" '"+k.shift()+"' ")
    c1=alphabet[2] + (cursor+2).toString()
    cl=alphabet[2+k.length-1]+(cursor+2).toString()
    range=c1+":"+cl
    await sheet.loadCells(range)
    while (finished!=true) {
        cell=alphabet[i] + (cursor+2).toString()
        cell_reflect = sheet.getCellByA1(cell)
        n = Number(cell_reflect.value)
        console.log(n)
        if (n == '') {
            final_massive.push(" null")
        } else {
            final_massive.push(" '"+n+"'")
        }
        c = cell_reflect["backgroundColor"]
        if (c != undefined) {
            if (c["red"] ===  0.6 && c["blue"] === 1) {
                final_massive.push(" '7'")
            } else {
                final_massive.push(" null")
            }
        }
        else{
            final_massive.push(" null")
        }
        if(cell==cl){
            finished=true
        }
        i+=1
    }
    return final_massive
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
async function updateCell(cell,sheet,comm,color,ur){
    const listOfColors = [
        {color: {red: 139/255, green: 26/255, blue: 16/255, alpha: 0}},
        {color: {red: 234/255, green: 51/255, blue: 35/255, alpha: 0}},
        {color: {red: 241/255, green: 158/255, blue: 56/255, alpha: 0}},
        {color: {red: 255/255, green: 255/255, blue: 84/255, alpha: 0}},
        {color: {red: 117/255, green: 251/255, blue: 76/255, alpha: 0}},
        {color: {red: 117/255, green: 251/255, blue: 253/255, alpha: 0}},
        {color: {red: 234/255, green: 51/255, blue: 247/255, alpha: 0}},
    ]
    await sheet.loadCells(cell)
    console.log(cell)
    console.log(color)
    Col=listOfColors[Number(color)].color
    console.log(Col)
    sheet.getCellByA1(cell)["backgroundColor"]=Col
    k=await sheet.getCellByA1(cell).value
    const fulladress="http://192.168.1.6:3000/videowatchingbytrainer/"+ur
    sheet.getCellByA1(cell).formula= '=HYPERLINK('+'"'+fulladress+'";'+'"'+k+'")'


    prevnote=await sheet.getCellByA1(cell).note
    tez=""
    user=await  sheet.getCellByA1(cell)["note"]
    console.log(user)//tez=user+"\nТренер: "
    if (user === undefined){
        tez = "Тренер: "
        if(comm!=""){sheet.getCellByA1(cell).note=tez+comm}

    }else {

        tez=user+"\nТренер: "
        if(comm!=""){sheet.getCellByA1(cell).note=tez+comm}
    }
    // try{
    //     tez=user+"\nТренер:"
    //     if(comm!=""){sheet.getCellByA1(cell).note=tez+comm}
    //
    // }
    // catch (e){
    //     if(comm!=""){sheet.getCellByA1(cell).note=comm}
    // }

    await sheet.saveUpdatedCells()
}

function get_cursor_on_Ex(JS,ex,date){
    var cursor
    JS.forEach(train=>{
        if (train.name[0]==ex){cursor=train.start+Number(date)+1}})
    return cursor
}

async function get_all_execises(rows,date,json,googletable,sheet){
    massive=[]
    sec=[]
    console.log(json.length)
    for (i=0;i<json.length;i++){
        console.log(json[i]["name"][1])
        if(json[i]["end"]!=undefined){
            if(json[i]["name"][1]=="Plus"){
                await getPlusRow(rows[2*date-1]._rawData,rows[2*date]._rawData,json[i]["name"][0])
                continue
            }
        else{
                console.log("This date "+date)
                console.log("прошел отбор "+json[i]["end"])
                k=await get_row_of_training(rows,date.toString(),json[i].start,json[i].end,json[i].name[0],googletable,sheet)
                massive.push(k)}
        }
            }
    return [massive,sec]
}

async function getPlusRow(row_one,row_two,title){
    row_one.shift()
    row_one.shift()
    row_two.shift()
    row_two.shift()
    row_two.pop()
    mass=["'"+title+"'","null"]
    for (l=0;l<row_two.length;l++){
        last_ex=row_two[l]
        if(last_ex[last_ex.length-1]=="+"){
            mass.push("-"+last_ex.split("+")[0])
        }
        else{
            mass.push(row_two[l])
        }
        mass.push(row_one[l].split(",")[0])
    }
    sec.push(mass)
}


module.exports={fillJSON,setExNullable,get_row_of_training,updateCell,get_cursor_on_Ex,get_all_execises}