const pg=require("pg");
const { Pool } = pg;
const teleg=require("./telegram")

const pool=new Pool({
    user:"postgres",
    password:"Nopassaran",
    host:"localhost",
    port:5432,
    database:"WebFitness"
})

function select_approved(number){
    pool.query("SELECT approved from f where number = $1",[number],(err,res)=>{
        return res.rows[0]
    })
}
function select_chat_id(number){
    pool.query("Select chat_id from f where number = $2",[number],(err,res)=>{
        result=res.rows[0]
        return result
    })
}

async function telegram_alert(number){
    approved=await select_approved(number)
    chat_id=await select_chat_id(number)
    if(approved){
    teleg.alert_user(chat_id)}
}


    function UpdateExeciseWeight(massive){
    pool.query("UPDATE f Set execises = $1, weight = $2",[massive[0],massive[1]]);}

function UpdateE(massive){
    UpdateExeciseWeight(massive)
    for (var i=2; i<massive.length;i++){
        var  e=i-1
        console.log(e)
        pool.query("UPDATE f Set e"+i+" = $1",[massive[i]])
    }
}
function UpdateProperties(name,value,mobile){
    pool.query("UPDATE mishabot Set "+name+" = $1 where number = $2",[value,mobile])
}

function u(allData){
    var massive=[]
    allData.forEach(row=>{
        const responceUser={
            "mobile":row["number"] ,
            "googlesheets":  row["googleforms"],
            "diete": row["diete"],
            "approved":  row["approved"],
            "payment": row["payment"]
        }
        massive.push(responceUser)
    })
    return massive
}


module.exports={UpdateE,u,pool,UpdateProperties,telegram_alert}
