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


async function UpdateE(massive,mobilenum){
    console.log(massive)
    querry="INSERT INTO f"+mobilenum+" Values ( "+massive+" );"
    console.log(querry)
     await pool.query(querry)
    console.log("успешно заимпортили")
}
function UpdateProperties(name,value,mobile){
    pool.query("UPDATE mishabot Set "+name+" = $1 where number = $2",[value.toString(),mobile.toString()])
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
async function reload_all(mobile_num,updateProperties,sec){
    await drop_table_and_newCreate(mobile_num)
    if (sec!=null){
        await UpdateE(sec,mobile_num)
        querry="Update f"+mobile_num+" Set type = 'p' where execises = "+sec[0][0]
        await pool.query(querry)
    }
    await updateProperties.forEach(async row=>{
           await UpdateE(row,mobile_num)
           querry="update f"+mobile_num+" Set type = 'c' where execises = "+row[0]
           await pool.query(querry)
    })

    console.log("Забито в таблицу")
}


async function drop_table_and_newCreate(mobile_num){
    await pool.query("Drop table f"+mobile_num)
    await pool.query("create table f79164009726\n" +
        "(\n" +
        "    execises text,\n" +
        "    weight   text,\n" +
        "    e1       integer,\n" +
        "    e1_color integer,\n" +
        "    e2       integer,\n" +
        "e2_color integer,\n" +
        "    e3       integer,\n" +
        "e3_color integer,\n" +
        "    e4       integer,\n" +
        "e4_color integer,\n" +
        "    e5       integer,\n" +
        "e5_color integer,\n" +
        "    e6       integer,\n" +
        "e6_color integer,\n" +
        "    e7       integer,\n" +
        "e7_color integer,\n" +
        "    e8       integer,\n" +
        "e8_color integer,\n" +
        "type char\n"+
        ")")
    console.log("пересоздана")
}

module.exports={UpdateE,getUsers,select_chat_id,UpdateProperties,NotifyUser,geDate,tableexist,select_google_sheets,reload_all,drop_table_and_newCreate}
