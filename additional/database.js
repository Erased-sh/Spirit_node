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

async function select_approved(number){
    return (await pool.query("Select approved from mishabot where number = $1",[number.toString()])).rows[0]["approved"]
}
async function select_chat_id(number){
    return (await pool.query("Select chat_id from mishabot where number = $1",[number.toString()])).rows[0]["chat_id"]
}
async function geDate(number) {
    return (await pool.query("Select date from mishabot where number = $1",[number.toString()])).rows[0]["date"]
}
async function NotifyUser(number,now){
     if(await check(number,now)){
       teleg.alert_user(await select_chat_id(number))
     }
}

async function select_google_sheets(number){
    return (await pool.query("Select googleforms from mishabot where number = $1",[number.toString()])).rows[0]["googleforms"]
}

async function check(number,now){
   k= (await select_approved(number))!=now
    console.log(k)
    return k
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
async function getUsers(){
    var massive=[]
    const All_Users_In_Database=await pool.query("Select * FROM mishabot")
    All_Users_In_Database.rows.forEach(row=>{
        const responceUser={
            "mobile":row["number"] ,
            "googlesheets":  row["googleforms"],
            "diete": row["diete"],
            "approved":  row["approved"],
            "payment": row["payment"]
        }
        massive.push(responceUser)
    })
    console.log(massive)
    return massive
}


module.exports={UpdateE,getUsers,pool,UpdateProperties,NotifyUser,geDate,tableexist,select_google_sheets}
