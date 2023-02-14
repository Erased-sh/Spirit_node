const fs = require("fs");
const staticpath="/Users/shaya/PycharmProjects/MishaBot/Trainings/TrainingsVideos";
const pathfortrainings="/Users/shaya/PycharmProjects/MishaBot/Trainings/All";
module.exports={starter,getNumber,rem,metrica}
const parc=require("./parcer")

async function starter(){
    console.log("Scanning videos in directory...")
    const Files=fs.readdirSync(staticpath);
    Files.shift()
    Files.forEach(async (file)=>{
        const mobilenumber=file.split("_")[0]
        const action=file.split("_")[1].split(".")[0]
        console.log(mobilenumber+" a "+action);

        const exist=fs.readdirSync(pathfortrainings);
        if(checkdirectory(exist,mobilenumber,file)==false){addnewdir(mobilenumber,file)}
    });
    }

function remove(file,newPath,sep="_",stpath=staticpath){
    fullname=file.split(sep)
    fullname.shift()
    fullname.join(sep)
    fs.rename(stpath+"/"+file, newPath+"/"+fullname, err => {
        if(err) throw err; // не удалось переместить файл
        console.log('Файл успешно перемещён в '+newPath);
        fs.close
    });
}
async function rem(firstpath,dir){
    previousadress=firstpath+dir
    newadress=firstpath+"w"+dir
    if (dir[0]=="w"){
        return previousadress
    }
    await fs.rename(previousadress,newadress,err => {
        console.log('Файл успешно перемещён в '+newadress);
        fs.close

    })
    console.log("thisss iss"+newadress)
    fs.close
    return newadress

}
function getNumber(massive){
    var last=""
    massive.forEach((element)=>{
        if(element!='.DS_Store')
        last=element.toString()
    })
    return last
}

function checkdirectory(exist,mobilenumber,file){
   var k=false;
    exist.forEach( (num)=>{
        if (num==mobilenumber){
            console.log("Папка существует")
            const alltrainings=fs.readdirSync(pathfortrainings+"/"+mobilenumber)
            console.log(alltrainings)
            try{
                lastnum=Number(getNumber(alltrainings))+1
                console.log(k)
                l=pathfortrainings+"/"+mobilenumber+"/"+String(lastnum)
                console.log(l)
                fs.mkdirSync(l)
                console.log("Создана новая папка тренировки"+l)
                remove(file,l);
                k=true;
            }
            catch (e){
                l=pathfortrainings+"/"+mobilenumber+"/"+String(1);
                fs.mkdirSync(l)
                console.log("Создана первая папка для нумерации тренировок");
                remove(file,l);
                k=true;
            }}
    })
    return k;
}

function addnewdir(mobilenumber,file){
    fs.mkdirSync(pathfortrainings+"/"+mobilenumber)
    console.log("Новая папка создана")
    l=pathfortrainings+"/"+mobilenumber+"/"+String(1)
    fs.mkdirSync(l)
    remove(file,l)
    console.log("Видео было впервые добавлено")
}

function metrica(adress,plus){
    var videoPath = '/Users/shaya/PycharmProjects/MishaBot/Trainings/All/'+adress.toString()
    const Files=fs.readdirSync(videoPath)
    Files.shift()
    var date=getNumber(Files)
    videoPath=videoPath+"/"+date.toString()+"/"
    const dir=fs.readdirSync(videoPath)

    dir.forEach(name=>{
        if(name[0]=="w"&name!='wundefined'){
            l=name.split(",")
            var DataForGoogle={
                "мобильный номер": adress.toString(),
                "тип":"",
                "подход":"",
                "плюсы":"",
                "тренировка":""
            }
            DataForGoogle["тип"]=l[0].slice(1).toString()
            DataForGoogle["подход"]=l[2].toString()
            DataForGoogle["плюсы"]=plus.toString()
            DataForGoogle["тренировка"]=date
            console.log(DataForGoogle)
            var nam="f"+DataForGoogle["тип"].toString()+"_"+DataForGoogle["подход"].toString()+"_"+"plus_"+DataForGoogle["плюсы"]+"."+name.split(".")[1]
            console.log(videoPath+nam)
            fs.rename(videoPath+name,videoPath+nam,err => {
                console.log(DataForGoogle["тренировка"]+"IDD")
                fs.close
                parc.Distributer(DataForGoogle["тренировка"],DataForGoogle["мобильный номер"],DataForGoogle["тип"],DataForGoogle["подход"],DataForGoogle["плюсы"])
            })


        }
    })

}

