const mysql = require('mysql');
const express = require("express");
const { request } = require("express");
const app = express();
app.use(express.json());

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hotelbookingapp',
    multipleStatements:true
  });
 

app.get("/Hotels", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})
app.post("/Login", async (req, res) => {
    let result = {}
    try {
        console.log(req.body)
        const reqJson = req.body;
        CostumerName=reqJson.name;
        CostumerSurName=reqJson.surname;
        CostumerEmail=reqJson.email;
        CostumerPassword=reqJson.password;
        result.success=await createTodo(CostumerName,CostumerSurName,CostumerEmail,CostumerPassword)
        
        result.success = true;
    }
    catch (e) {
        result.success = false;
    }
    finally {
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
})

app.delete("/Login",async(req,res)=>{
    let result={}
    try{
        const reqJson=req.body;
        CostumerName=reqJson.name;
        result.success=await deleteTodo(CostumerName);
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type","application/json")
        res.send(JSON.stringify(result))
    }
})

app.listen(8080, () => console.log("Web server is listening.. on port 8080"))


start()
async function start() {
    await connection();
    console.log('Api works');

    /*
    const todo= await readTodos();
    console.log(todo);
    const successCreate= await createTodo("
    ");
    console.log(`Creating was ${successCreate}`)

    const successDelete=await deleteTodo(1)
    console.log(`Deleting was ${successDelete}`)
    */
}
async function connect() {
    try {
        await   mysqlConnection.connect();
    }
    catch (e) {
        console.error(`Failed to connect ${e}`)
    }
}
async function readTodos() {
    try {
        const results = await client.query("select * from Hotels")
        return results.rows;
    }
    catch (e) {
        return []
    }
}

async function createTodo(CostumerName,CostumerSurName,CostumerEmail,CostumerPassword) {
    try {   
        let result = await client.query("insert into Login values ($1,$2,$3,$4)",[CostumerName,CostumerSurName,CostumerEmail,CostumerPassword])
        if(result.rowCount > 0){
            return true;
        }
        else{
            return false;
        }
    }
    catch (e) {
        return false;
    }
}

async function deleteTodo(CostumerName) {
    try {
        const result = await this.client.query('INSERT INTO Login(comp_name,comp_surname,email,password) VALUES($1,$2,$3,$4)', [CostumerName,CostumerSurName,CostumerEmail,CostumerPassword]);

       // let result = await client.query("delete from Login where name = $1", [CostumerName]);
        console.log(result.rowCount);
        if (result.rowCount > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
}



