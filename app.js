const express = require('express');
const DB=require("./additional/database")
const V_S=require("./files/Stream/video_share")
const fs = require('fs')
const cc=require('./files/contentchecker')
const additional=require('./files/Additional')
const marker=require("./GoogleTables/parcer")
const app = express();
const bodyParser = require('body-parser');
const {getNumber, rem} = require("./files/contentchecker");
const {telegram_alert, NotifyUser, selectDate} = require("./additional/database");
const {mark_comment, getTraining} = require("./GoogleTables/parcer");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/video/:id', async (req, res) => {
 console.log("Админ просматривает видео")
 const mobile_number=req.params.id
 var date=Number(await DB.geDate(mobile_number))-1
 try{final_path=await additional.re(mobile_number,date,false)
  if (final_path=="No"){res.send("No video")}
  else{V_S.CreateStream(req,res,final_path)}}
 catch (e){
  console.log("все")
 }


 });
app.post("/mobile/:id", async (req,res,next)=>{
 console.log("Фильтрация видео")
 params=req.params.id.toString()
 message=req.body
 cc.metrica(params,message["value_or_plus"])
});
app.post("/commentere",async (req,res)=>{
 console.log("Пользователь оставил комментарий")
 message=req.body //google_sheets //date //type //comm
 try{
 mark_comment(message["ex"],message["date"],message["comm"],message["googlesheets"])
 res.send("ok")}
 catch (e){
  res.send(e.toString())
 }

})
app.post("/mobileapplication", async (req,res,next)=>{
 console.log("Парметры пользователя обновлены")
 message=req.body
 NotifyUser(message["mobile"],message["approved"])
 DB.UpdateProperties("approved", message["approved"],message["mobile"])
 DB.UpdateProperties("diete",message["diete"],message["mobile"])
 DB.UpdateProperties("googleforms",message["googleforms"],message["mobile"])
 DB.UpdateProperties("payment",message["payment"],message["mobile"])
 res.json("OK")
 next();
});
app.get("/getTrain/:id",async (req,res)=>{
 googletable=req.params.id.toString()
 console.log("Была запрошена вся тренировка из гугл таблицы")
 try{
  res.send(await getTraining(googletable))
 }
 catch (err){
  res.send("Err")
 }
})
app.get("/mobileapplication", async (req, res, next)=>{
 console.log("Showing all users")
 res.setHeader("content-type","application/json")
 res.json(await DB.getUsers())})




app.listen(3000,"192.168.1.6",()=> {
 console.log("Server Launched!")
 setInterval(cc.starter,3000)//Проверять каждые 30 секунд новые видео

})