const express = require('express');
const DB=require("./database")
const fs = require('fs')
const cc=require('./contentchecker')

const app = express();
const bodyParser = require('body-parser');
const {getNumber, rem} = require("./contentchecker");
const {telegram_alert} = require("./database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


 
app.get("/mobileapplication", async (req, res, next)=>{
 console.log("Wow")
 res.setHeader("content-type","application/json")
 const querry="Select * FROM mishabot"
 DB.pool.query(querry, async (err, re) => {
  allData = re.rows
  m = await DB.u(allData)
  res.json(m)})
});

app.get('/video/:id', async (req, res) => {
 console.log("started video search")
 var adress=req.params.id

var videoPath = '/Users/shaya/PycharmProjects/MishaBot/Trainings/All/'+adress.toString()
 const Files=fs.readdirSync(videoPath)
 videoPath=videoPath+"/"+getNumber(Files).toString()+"/"
 const dir=fs.readdirSync(videoPath)
 vid=""
 dir.forEach(name=>{
  if (name[0]=="w"&name!="undefined"&name!="wundefined"){
      vid=name
  }})
  if(vid==""){
   dir.forEach(name=>{
    if(name!="f"&name!="undefined"&name!="wundefined"){
     vid=name
    }
   })
  }
  if(vid==""){
   return
  }

 console.log(dir)
 pth= await rem(videoPath,vid)
 pk=pth
 console.log("And this is path" + pk)

 videoStat = fs.statSync(pk)
 console.log("Yep")
 const fileSize = videoStat.size;
 const videoRange = req.headers.range;
 if (videoRange) {
  const parts = videoRange.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1;
  const chunksize = (end-start) + 1;
  const file = fs.createReadStream(pk, {start, end});
  const head = {
   'Content-Range': `bytes ${start}-${end}/${fileSize}`,
   'Accept-Ranges': 'bytes',
   'Content-Length': chunksize,
   'Content-Type': 'video/mp4',
  };
  res.writeHead(206, head);
  file.pipe(res);
 } else {
  const head = {
   'Content-Length': fileSize,
   'Content-Type': 'video/mp4',
  };
  res.writeHead(200, head);
  fs.createReadStream(pth).pipe(res);
 }
});







app.post("/mobileapplication", async (req,res,next)=>{
 console.log(req.body)
 message=req.body
 telegram_alert(message["approved"])
 DB.UpdateProperties("approved", message["approved"],message["mobile"])
 DB.UpdateProperties("diete",message["diete"],message["mobile"])
 DB.UpdateProperties("googleforms",message["googleforms"],message["mobile"])
 DB.UpdateProperties("payment",message["payment"],message["mobile"])
 res.json("OK")
 next();
});

app.post("/mobile/:id", async (req,res,next)=>{
 params=req.params.id.toString()
 console.log(req.body)
 message=req.body
 cc.metrica(params,message["value_or_plus"])

});




app.listen(3000,"192.168.1.6",()=> {
 console.log("Server Launched!")
 setInterval(cc.starter,30000)

})