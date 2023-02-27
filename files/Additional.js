const {rem} = require("./contentchecker");
fs=require("fs")
cc=require("./contentchecker")

function GetUserVideo(videopath,date,Ack){ //Возвращает видео для стрима. С тэгом w в первую очередь, без тэга во вторую и бросает отказ в f
     const videoPath=videopath+"/"+date.toString()
    const dir=filt(fs.readdirSync(videoPath))
    massive=[]
    dir.forEach(name=>{if (name[0]=="w"&name!="undefined"&name!="wundefined"){massive.push(name)}})
     if(massive.length!=0){return videoPath+"/"+massive[0]}
     else{dir.forEach(name=>{if(name[0]!="f"&name!="undefined"&name!="wundefined"){massive.push(name)}})}
     if(massive.length!=0){return videoPath+"/"+massive[0]}
     else{
         console.log(Ack)
         if (Ack==false){return GetUserVideo(videopath,date+1,true)}
         else{return "No"}}
 }
async function re(adress,date,ask){ //формирует полный адрес видео
    var videoPath = '/Users/shaya/PycharmProjects/MishaBot/Trainings/All/'+adress.toString()
    var Attempt=GetUserVideo(videoPath,date,ask)
    if (Attempt=="No"){return "No"}
    k=Attempt.toString().split("/")
    pth= await rem(Attempt,k[k.length-1])
    if(pth=="no"){return re(adress,date,ask)}
    else{return pth}
}
function filt(dir){ //Удаляет из массива сраный ".ds_store"
    let newArray = dir.filter(function(f) { return f !== ".DS_Store" });
    return newArray
}
function getNumber(massive){ //последняя цифра папки с тренировкой
    var last=""
    massive.forEach((element)=>{
        if(element!='.DS_Store')
            last=element.toString()
    })
    return last
}

module.exports={GetUserVideo,re,filt,getNumber}