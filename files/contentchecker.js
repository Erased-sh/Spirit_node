const fs = require("fs");
const staticpath="/Users/shaya/PycharmProjects/MishaBot/Trainings/TrainingsVideos";
const pathfortrainings="/Users/shaya/PycharmProjects/MishaBot/Trainings/All";
module.exports={starter,getNumber,rem,metrica,filt}
const parc=require("./parcer")
const DB = require("./database");
const additional = require("./Additional");

async function starter(){

    console.log("Scanning videos in directory...")
    const Files=filt(fs.readdirSync(staticpath));
    Files.forEach(async (file)=>{
        const mobilenumber=file.split("_")[0]
        date=await DB.geDate(mobilenumber)
        const action=file.split("_")[1].split(".")[0]
        const exist=filt(fs.readdirSync(pathfortrainings));
        console.log("Ok")
        if(checkdirectory(exist,mobilenumber,file,date)==false){addnewdir(mobilenumber,file)}
    });
    }

function remove(file,newPath,sep="_",stpath=staticpath){
    fullname=file.split(sep)
    console.log(fullname)
    fullname.shift()
    fullname.join(sep)
    fs.rename(stpath+"/"+file, newPath+"/"+fullname, err => {
        if(err) throw err; // не удалось переместить файл
        console.log('Файл успешно перемещён в '+newPath);
        fs.close
    });
}
async function rem(firstpath,dir){
    previousadress=firstpath
    spladr=firstpath.toString().split("/")
    spladr.pop()
    newadress=spladr.join("/")+"/"+"w"+dir

    if (dir[0]=="w"){
        fs.close
        return previousadress
    }
    else{
        if(dir[0]=="f"){fs.close
        return "no"}
        else{
        await fs.rename(previousadress,newadress,err => {
            console.log('Файл успешно перемещён в '+newadress);
            fs.close
        })}
        return newadress
    }

}
function getNumber(massive){
    var last=""
    massive.forEach((element)=>{
        if(element!='.DS_Store')
        last=element.toString()
    })
    return last
}

async function checkdirectory(exist,mobilenumber,file,date){
    var k=false;
    exist.forEach( (num)=>{
        if (num==mobilenumber){
            console.log("Папка существует")
            const alltrainings=filt(fs.readdirSync(pathfortrainings+"/"+mobilenumber))
            console.log(alltrainings)
            if(alltrainings.includes(date.toString())){
                l=pathfortrainings+"/"+mobilenumber+"/"+date.toString()
                remove(file,l)
                return true
            }
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

async function metrica(adress,plus){
    const d=await DB.geDate(adress)
    var name=" "
    var date=Number(d)-1
    var videoPath = '/Users/shaya/PycharmProjects/MishaBot/Trainings/All/'+adress.toString()
    var Attempt=additional.GetUserVideo(videoPath,date,false)
    if (Attempt=="No"){return}
    else{
        k=Attempt.toString().split("/")
        name=k[k.length-1]
    }
    console.log("TTT "+name)
        if(name[0]=="w"&name!='wundefined'){
            l=name.split(",")
            var DataForGoogle={
                "мобильный номер": adress.toString(),
                "тип":"",
                "подход":"",
                "плюсы":"",
                "тренировка":""
            }
            oldpath=Attempt
            console.log(oldpath)
            DataForGoogle["тип"]=l[0].slice(1).toString()
            DataForGoogle["подход"]=l[1].toString()
            DataForGoogle["плюсы"]=plus.toString()
            DataForGoogle["тренировка"]=l[2].toString()
            var y=k
            y.pop()
            console.log(y)
            newpath=y.join("/")+"/"+"f"+name.slice(1)
            console.log(newpath)
            fs.rename(oldpath,newpath,err => {
                console.log("Файл больше недоступен")
                fs.close
               // parc.Distributer(DataForGoogle["тренировка"],DataForGoogle["мобильный номер"],DataForGoogle["тип"],DataForGoogle["подход"],DataForGoogle["плюсы"])
            })


        }

}

function filt(dir){
    let newArray = dir.filter(function(f) { return f !== ".DS_Store" });
    return newArray
}