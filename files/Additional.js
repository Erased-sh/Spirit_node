const {rem} = require("./contentchecker");
fs=require("fs")
cc=require("./contentchecker")

 function GetUserVideo(videopath,date,Ack){
     const videoPath=videopath+"/"+date.toString()
    const dir=cc.filt(fs.readdirSync(videoPath))
    massive=[]
    dir.forEach(name=>{if (name[0]=="w"&name!="undefined"&name!="wundefined"){massive.push(name)}})
     console.log(massive)
     if(massive.length!=0){return videoPath+"/"+massive[0]}
     else{dir.forEach(name=>{if(name[0]!="f"&name!="undefined"&name!="wundefined"){massive.push(name)}})}
     console.log(massive)
     if(massive.length!=0){return videoPath+"/"+massive[0]}
     else{
         console.log(Ack)
         if (Ack==false){return GetUserVideo(videopath,date+1,true)}
         else{return "No"}}
 }
 module.exports={GetUserVideo,re}

async function re(adress,date,ask){
    var videoPath = '/Users/shaya/PycharmProjects/MishaBot/Trainings/All/'+adress.toString()
    var Attempt=GetUserVideo(videoPath,date,ask)
    if (Attempt=="No"){return "No"}
    k=Attempt.toString().split("/")
    pth= await rem(Attempt,k[k.length-1])
    if(pth=="no"){return re(adress,date,ask)}
    else{return pth}
}