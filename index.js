const mysql = require('mysql');
const express = require("express");
const { request } = require("express");
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hotelbookingapp'
});

app.get("/Hotels", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
}) ;

app.post("/Hotels", async (req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        HotelId=reqJson.id_hotel;
        HotelName=reqJson.Hotel_name;
        City=reqJson.City;
        address=reqJson.Address;
        phone=reqJson.Phone;
        Comments=reqJson.comments;
        stars=reqJson.evaluation_stars;
        images=reqJson.Hotel_image;
        email=reqJson.email;
        site=reqJson.site;
        //console.log(HotelId, HotelName,City,address,phone,Comments,stars,images,email,site)
        await createTodo(HotelId, HotelName,City,address,phone,Comments,stars,images,email,site);
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
app.listen(8080, () => console.log("Web server is listening.. on port 8080"))
start()
async function start(){
    await connect();
    console.log('Api works');

}
async function connect() {
        connection.connect((err) => {
            if (err) throw err;
            console.log('Connected!');
          });
    }
async function readTodos() {
        try {
            console.log("Hi")
            const results = await connection.query("select * from Hotels")
            console.log(results)
            return results.rows;
        }
        catch (e) {
            console.log("Error")
            return []
        }
    }

    async function createTodo(HotelId, HotelName,City,address,phone,Comments,stars,images,email,site) {
        console.log(HotelId, HotelName,City,address,phone,Comments,stars,images,email,site)
        try {   

            let result = await client.query("insert into Hotels values ($1,$2,$3,$4,$5,$6,$7,$8,$9$,$10)", [HotelId, HotelName,City,address,phone,Comments,stars,images,email,site])
           console.log(result)
            console.log(result.rowCount)
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





