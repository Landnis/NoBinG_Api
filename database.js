const mysql=require('mysql');
const express =require('express');
var app=express();
var cors = require('cors')
const bodyparser=require('body-parser')
app.use(bodyparser.json());
app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hotelbookingapp',
    multipleStatements:true
  });
  mysqlConnection.connect((err)=>{
    if(!err){
        console.log('DB connection succeded.!');
    }else{
        console.log('DB connection failed\n Error:'+JSON.stringify(err,undefined,2));
    }
});
app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

app.get('/Hotels',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Hotels',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});
app.get('/Hotels/names',(req,res)=>{
    mysqlConnection.query('SELECT DISTINCT(City) FROM Hotels',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});



//Delete an hotel
app.delete('/Hotels/:id',(req,res)=>{
    mysqlConnection.query('delete from Hotels where id_hotel=?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log(req.params.id)
            res.send('Deleted successfully');
        }else{
            console.log(err);
        }
    })
});
//insert a hotel
/*app.post('/Hotels',(req,res)=>{
    let emp=req.body;
    console.log(emp.id_hotel,emp.Hotel_name,emp.City,emp.Address,emp.Phone,emp.comments,emp.evaluation_stars,emp.Hotels_image,emp.email,emp.site)
   // var sql="SET @id_hotel = ?; SET @Hotel_name=?; SET @City= ?; SET @Address= ?; SET @Phone= ?; SET @comments= ?; SET @evaluation_stars; SET @Hotels_image= ?; SET @email= ?; SET @site= ?"
   // console.log(sql) 
 // mysqlConnection.query(sql,[emp.id_hotel,emp.Hotel_name,emp.City,emp.Address,emp.Phone,emp.comments,emp.evaluation_stars,emp.Hotels_image,emp.email,emp.site],(err,rows,fields)=>{
    mysqlConnection.query("insert into Hotels SET ?",req.body,(err,rows,fields)=>{   
  
    if(!err){
            console.log(sql);
            res.send(rows)
        }
    })
})*/
app.post('/Hotels', function (req, res) {
    var postData  = req.body;
    console.log(req.params.id);
    mysqlConnection.query('INSERT INTO Hotels SET ?',postData, function (err, results, fields) {
        if(!err){
            console.log()
            res.send('Deleted successfully');
        }else{
            console.log(err);
        }
     });
 });


 app.get('/activities',(req,res)=>{
    mysqlConnection.query('SELECT * FROM activities',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
})
app.get('/activities/search',(req,res)=>{
    mysqlConnection.query('SELECT DISTINCT(city) FROM activities',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })



   
})

app.get('/RentCarsOffice',(req,res)=>{
    mysqlConnection.query('select * from rentoffice',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});

app.get('/RentCarsOffice/OnlyCities',(req,res)=>{
    mysqlConnection.query('select distinct(City) from rentoffice',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});

app.get('/GetAllCars',(req,res)=>{
    mysqlConnection.query('select * from vehicle',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});

app.get('/CarCategories',(req,res)=>{
    mysqlConnection.query('select distinct(category) from vehicle',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});

app.get('/CitiesOfmuseums',(req,res)=>{
    mysqlConnection.query('select distinct(city) from museums',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});

app.get('/AllMuseums',(req,res)=>{
    mysqlConnection.query('select * from museums',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});


