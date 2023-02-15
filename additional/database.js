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

async function select_approved(number,chat_id,jso){
    pool.query("Select approved from mishabot where number = $1",[number.toString()],async (err,res)=>{
        pool.close
        telegram_alert(chat_id,res.rows[0]["approved"],jso)
    })
}
async function NotifyUser(number,jso){
    pool.query("Select chat_id from mishabot where number = $1",[number.toString()],(err,res)=>{
        pool.close
        select_approved(number,res.rows[0]["chat_id"],jso)
    })
}



async function geDate(number) {
    const result = await pool.query("Select date from mishabot where number = $1",[number.toString()])
    return result.rows[0]["date"]
}

async function tableexist(number){
    massive=[]
    const table_values=await pool.query("Select execises from f"+number)
    table_values.rows.forEach(t=>{
        k=t["execises"]
        if(k!='f'){ massive.push(k)}

    })
    return massive.length
}

tableexist(";")


async function telegram_alert(chat_id, approved,jso){
    console.log(jso)
    console.log(approved)
    if(approved!=jso){
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


module.exports={UpdateE,u,pool,UpdateProperties,telegram_alert,NotifyUser,geDate,tableexist}
