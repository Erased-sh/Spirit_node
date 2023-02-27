const fs = require("fs");
const staticpath="/Users/shaya/PycharmProjects/MishaBot/Trainings/TrainingsVideos";
const pathfortrainings="/Users/shaya/PycharmProjects/MishaBot/Trainings/All";
module.exports={starter,rem,metrica}
const parc=require("../GoogleTables/parcer")
const DB = require("../additional/database");
const add = require("./Additional");
const {getNumber} = require("./Additional");

async function starter(){

    console.log("Scanning videos in directory...")
    const Files=add.filt(fs.readdirSync(staticpath));
    Files.forEach(async (file)=>{
        const mobilenumber=file.split("_")[0]
        date=await DB.geDate(mobilenumber)
        const action=file.split("_")[1].split(".")[0]
        const exist=add.filt(fs.readdirSync(pathfortrainings));
        k=await checkdirectory(exist,mobilenumber,file,date)
        if(k==false){addnewdir(mobilenumber,'/Users/shaya/PycharmProjects/MishaBot/Trainings/All')}


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

async function checkdirectory(exist,mobilenumber,file,date){
    var k=false;
    exist.forEach( (num)=>{
        if (num==mobilenumber){
            try{
            console.log("Папка существует")
            const alltrainings=add.filt(fs.readdirSync(pathfortrainings+"/"+mobilenumber))
            console.log(alltrainings.includes(date.toString()))
            if(alltrainings.includes(date.toString())){
                l=pathfortrainings+"/"+mobilenumber+"/"+date.toString()
                remove(file,l)
                k=true
            }
            else{
                console.log("Continues")
                console.log("ЖУЖУЖУ")
                lastnum=Number(getNumber(alltrainings))+1
                console.log(lastnum)
                l=pathfortrainings+"/"+mobilenumber+"/"+String(lastnum)
                console.log(l)
                fs.mkdirSync(l)
                console.log("Создана новая папка тренировки"+l)
                remove(file,l);
                k=true;
            }}
            catch (e){
                console.log("AWdAwdadaxsax")
                l='/Users/shaya/PycharmProjects/MishaBot/Trainings/All'+"/"+mobilenumber+"/"+String(1);
                fs.mkdirSync(l)
                console.log("Создана первая папка для нумерации тренировок");
                remove(file,l);
                k=true;
            }}
    })
    return k;
}

function addnewdir(mobilenumber,pathfortrainings){
    console.log(`Acke`)
    fs.mkdirSync(pathfortrainings+"/"+mobilenumber)
    console.log("Новая папка создана")
    l=pathfortrainings+"/"+mobilenumber+"/"+String(1)
    fs.mkdirSync(l)
    remove(pathfortrainings,l)
    console.log("Видео было впервые добавлено")
}

async function metrica(adress,plus,comm){
    const d=await DB.geDate(adress)
    var name=" "
    var date=Number(d)-1

    var videoPath = '/Users/shaya/PycharmProjects/MishaBot/Trainings/All/'+adress.toString()
    var Attempt=add.GetUserVideo(videoPath,date,false)
    if (Attempt=="No"){return}
    else{
        k=Attempt.toString().split("/")
        name=k[k.length-1]
        console.log(k)
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
            DataForGoogle["тип"]=l[0].slice(1).toString()
            DataForGoogle["подход"]=l[2].toString()
            DataForGoogle["плюсы"]=plus.toString()
            DataForGoogle["тренировка"]=await DB.geDate(adress.toString())
            var y=k
            y.pop()
            console.log("-----------------------")
            console.log(DataForGoogle)

            const google=await DB.select_google_sheets(adress.toString())
            newpath=y.join("/")+"/"+"f"+name.slice(1)
            console.log(newpath)
            fs.rename(oldpath,newpath,err => {
                console.log("Файл больше недоступен")
                fs.close
            })
            const url=adress.toString()+"/"+DataForGoogle["тренировка"]+"/"+"f"+name.slice(1)
            parc.Distributer(DataForGoogle["тренировка"],adress.toString(),DataForGoogle["тип"],DataForGoogle["подход"],DataForGoogle["плюсы"],google,comm,url)


        }

}
