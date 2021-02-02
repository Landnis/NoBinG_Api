require('dotenv').config()
const mysql = require('mysql');
const express = require('express');
var app = express();
var cors = require('cors');
const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let refreshTokens = []
const bodyparser = require('body-parser');
const { defaultMaxListeners } = require('nodemailer/lib/mailer');
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
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeded.!');
    } else {
        console.log('DB connection failed\n Error:' + JSON.stringify(err, undefined, 2));
    }
});
app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

app.get('/Hotels', authenticateToken, (req, res) => {
    mysqlConnection.query('SELECT * FROM Hotels', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get('/GetHotels', (req, res) => {
    mysqlConnection.query('SELECT * FROM Hotels', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});
app.get('/Hotels/names', (req, res) => {
    mysqlConnection.query('SELECT DISTINCT(City) FROM Hotels', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});



//Delete an hotel
app.delete('/Hotels/:id', (req, res) => {
    mysqlConnection.query('delete from Hotels where id_hotel=?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            console.log(req.params.id)
            res.send('Deleted successfully');
        } else {
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
    var postData = req.body;
    console.log(req.params.id);
    mysqlConnection.query('INSERT INTO Hotels SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log()
            res.send('Deleted successfully');
        } else {
            console.log(err);
        }
    });
});


app.get('/activities', authenticateToken, (req, res) => {
    mysqlConnection.query('SELECT * FROM activities', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
})
app.get('/getActivities', (req, res) => {
    mysqlConnection.query('SELECT * FROM activities', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
})
app.get('/activities/search', (req, res) => {
    mysqlConnection.query('SELECT DISTINCT(city) FROM activities', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    })




})

app.get('/RentCarsOffice', authenticateToken, (req, res) => {
    mysqlConnection.query('select * from rentoffice', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});
app.get('/Offices', (req, res) => {
    mysqlConnection.query('select * from rentoffice', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});



app.get('/RentCarsOffice/OnlyCities', (req, res) => {
    mysqlConnection.query('select distinct(City) from rentoffice', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get('/GetAllCars', (req, res) => {
    mysqlConnection.query('select * from vehicle', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});
app.get('/GetAllCarsAdmin', (req, res) => {
    mysqlConnection.query('SELECT marka, category FROM  vehicle GROUP BY ArKykl;', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get('/CarCategories', (req, res) => {
    mysqlConnection.query('select distinct(category) from vehicle', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get('/CitiesOfmuseums', (req, res) => {
    mysqlConnection.query('select distinct(city) from museums', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get('/AllMuseums', authenticateToken, (req, res) => {
    mysqlConnection.query('select * from museums', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});
app.get('/AdminMuseums', (req, res) => {
    mysqlConnection.query('select * from museums', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get("/AllRestaurants", authenticateToken, (req, res) => {
    mysqlConnection.query('select * from restaurants', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});
app.get("/AdminRestaurants",(req, res) => {
    mysqlConnection.query('select * from restaurants', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

app.get("/CitiesOfRestaurants", (req, res) => {
    mysqlConnection.query('select distinct(city) from restaurants', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

app.post('/register', async function (req, res) {
    var postData = req.body;
    //console.log(postData);
    try {
        const hashedPassword = await bcrypt.hash(req.body.User_password, 10)
        console.log(hashedPassword);
        postData.User_password = hashedPassword;
        console.log(postData)
        mysqlConnection.query('INSERT INTO users SET ?;SELECT LAST_INSERT_ID() AS UserId;', postData, function (err, results, fields) {
            if (!err) {
                console.log(postData);
                results.push(postData)
                console.log(results[1][0].UserId)
                res.status(201).json(results)

            } else {
                console.log(err);
            }
        });
    } catch {
        res.status(500).send()
    }

});

app.post("/Login/users", (req, res) => {
    const data = req.body;
    const email = data.email
    message = 'Not succeed';
    // console.log(data);
    const user = mysqlConnection.query(`select * from users where mail='${data.email}'`, data, async function (err, results, fields) {
        if (!err) {
            // console.log(res)
            if (results.length > 0) {
                try {
                    if (await bcrypt.compare(req.body.password, results[0].User_password)) {
                        console.log('Succeed')
                        console.log(data)
                        jwt.sign(data, "secretKey", (err, token) => {
                            console.log(token)
                            results.push(token)
                            console.log(results)
                            res.json(results)
                        })

                    } else {
                        console.log('Not succeed')
                        res.json(message)
                    }
                } catch {
                    res.status(500).send()
                }
                //const refreshToken= jwt.sign(email,process.env.REFRESH_ACCESS_TOKEN)
            } else {
                console.log(err)
                res.send(err)
            }
        } else {
            console.log(err);
        }
    });


});

/*function generateAccessToken(email){
    return jwt.sign(email,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'})

}*/
app.post("/Register/users", (req, res) => {
    const data = req.body;
    // console.log(data);

    mysqlConnection.query(`select * from users where mail='${data.mail}'`, data, function (err, results, fields) {
        if (!err) {

            if (results.length < 1) {
                jwt.sign(data, "secretKey", (err, token) => {
                    console.log(token)
                    results.push(data);
                    results.push(token)
                    console.log(results)

                    res.json(results)
                })
            } else {
                res.json(err)
            }
        } else {
            console.log(err);
        }
    });


});



function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, "secretKey", (err, email) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }
        req.email = email
        console.log("Middleware");
        next()
    })
}
function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    } else {
        res.sendStatus(403)
    }
}
//ADMIN PANEL////////////////////////////////////////////////////////////
app.post('/postHotels', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO Hotels SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/postOffice', async function (req, res) {
    var data = req.body;
    console.log(data);
    mysqlConnection.query('INSERT INTO rentoffice SET ?', data, function (err, results, fields) {
        if (!err) {
            console.log(data);
            res.status(201).json(data)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/postActivities', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO activities SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/postMuseums', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO museums SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null);
        }
    });
});

app.post('/postRestaurants', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO restaurants SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/postVehicle', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO vehicle SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            res.status(201).json(postData)

        } else {

            console.log(err);
            res.json(err)
        }
    });
});

app.get('/AllVehicle', (req, res) => {
    mysqlConnection.query('select * from vehicle', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get("/NumberOfHotels", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT COUNT(distinct City) as CitiesCount,COUNT(*) as NumberOfHotels FROM hotels;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].CitiesCount)
            console.log(results[0].NumberOfHotels)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });


});

app.get("/GroupOfHotels", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT City, COUNT(*) AS NumberOfHotels FROM  Hotels GROUP BY City;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].City)
            console.log(results[0].NumberOfHotels)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get("/NumberOfOffices", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT COUNT(distinct City) as CitiesCount,COUNT(*) as NumberOfOffices FROM rentoffice;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].CitiesCount)
            console.log(results[0].NumberOfOffices)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get("/GroupOfOffices", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT City, COUNT(*) AS NumberOfOffices FROM rentoffice GROUP BY City;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].City)
            console.log(results[0].NumberOfOffices)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get("/NumberOfActivities", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT COUNT(distinct city) as CitiesCount,COUNT(*) as NumberOfActivities FROM activities;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].CitiesCount)
            console.log(results[0].NumberOfActivities)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get("/GroupOfActivities", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT city, COUNT(*) AS NumberOfActivities FROM activities GROUP BY city;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].city)
            console.log(results[0].NumberOfActivities)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get("/NumberOfMuseums", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT COUNT(distinct city) as CitiesCount,COUNT(*) as NumberOfMuseums FROM Museums;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].CitiesCount)
            console.log(results[0].NumberOfMuseums)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get("/GroupOfMuseums", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT city, COUNT(*) AS NumberOfMuseums FROM Museums GROUP BY city;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].city)
            console.log(results[0].NumberOfMuseums)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get("/NumberOfRestaurants", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT COUNT(distinct city) as CitiesCount,COUNT(*) as NumberOfRestaurants FROM restaurants;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].CitiesCount)
            console.log(results[0].NumberOfRestaurants)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get("/GroupOfRestaurants", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT city, COUNT(*) AS NumberOfRestaurants FROM restaurants GROUP BY city;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].city)
            console.log(results[0].NumberOfRestaurants)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get("/GroupOfVehicle", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT category, COUNT(*) AS NumberOfVehicles FROM vehicle GROUP BY category;', function (err, results, fields) {
        if (!err) {
            console.log(results[0].category)
            console.log(results[0].NumberOfVehicles)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get('/Allusers', (req, res) => {
    mysqlConnection.query('select * from users', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
        }
    });

});
app.get("/NumberOfUsers", (req, res) => {
    const data = req.body;
    //console.log(data);

    const user = mysqlConnection.query('SELECT COUNT(*) as NumberOfUsers FROM users;', function (err, results, fields) {
        if (!err) {
            console.log(results)
            res.json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

//////RESERVED ROOMS///////////\\\\\\\\
app.post('/postRooms', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query(`INSERT INTO Rooms(price,Category,amount_rooms,maxPeople,CheckOut,CheckIn) VALUES('${postData.price}','${postData.Category}','${postData.amount_rooms}','${postData.maxPeople}','${postData.CheckOut}','${postData.CheckIn}'); SELECT LAST_INSERT_ID() AS RoomsId;`, function (err, results, fields) {
        if (!err) {
            console.log(results[1]);
            console.log(postData)
            results.push(postData)
            console.log(results[1][0])
            res.status(201).json(results)

        } else {
            console.log(err);
            res.json(null)
        }
    });

});

app.post('/ReservedRestaurants', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO restaurantreserv SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            console.log(postData)
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/ReservedActivities', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO activitiesreserv SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            console.log(postData)
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/ReservedMuseums', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO museumreservation SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            console.log(postData)
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/ReservedHotel', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO hotelreservation SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            console.log(postData)
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.post('/ReservedVehicle', async function (req, res) {
    var postData = req.body;
    console.log(postData);
    mysqlConnection.query('INSERT INTO vehiclereservation SET ?', postData, function (err, results, fields) {
        if (!err) {
            console.log(postData);
            console.log(postData)
            res.status(201).json(postData)

        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.post('/ContactForm', (req, res) => {
    //Step 1
    var postData = req.body;
    var name = postData.name;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingcontact@gmail.com',
            pass: 'nobingcontact'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingcontact@gmail.com',
        to: 'nobingapp@gmail.com',
        subject: `Καλησπερα Ονομάζομαι ${name}  ${postData.surname}`,
        text: `${postData.comment}`,
        html:`<h3 style="text-align:center;font-family:Optima">${postData.comment}</h3>`
    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {
            console.log(postData);
            console.log(postData.name)
            res.send(postData)
            console.log('Email sent!!');
        }
    });
})
//////
app.post('/ReservedHotelMail', (req, res) => {
    //Step 1
    var postData = req.body;
    console.log("Helloooooo", postData[0].firstname)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingapp@gmail.com',
            pass: 'nobingapp'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingapp@gmail.com',
        to: `${postData[0].mail},nobingapp@gmail.com`,
        cc: 'nobingapp@gmail.com',
        subject: `Η Κράτηση σας στο ${postData[2].Hotel_name} Ολοκληρώθηκε..!!`,
        text: "Η Κράτηση Σας Ολοκληρώθηκε Με Επιτυχία..",
        html: `
        <div style="width:100%;height:auto; background-color: darkseagreen">
        <h1 style="text-align:center; font-family:verdana">Στοιχεία Κράτησης</h1>
               <h3 style="text-align:center; font-family:verdana">Στοιχεία Χρήστη</h3>
            <p style="text-align:center;font-family:Optima">Όνομα: ${postData[0].firstname}</p>
            <p style="text-align:center;font-family:Optima">Επώνυμο:${postData[0].surname}</p>
            <p style="text-align:center;font-family:Optima">Email : ${postData[0].mail}</p>
        <h3 style="text-align: center; font-family:verdana">Στοιχεία Ξενοδοχείου</h3>
            <p style="text-align:center;font-family:Optima">Όνομα Ξενοδοχείου: ${postData[2].Hotel_name}</p>
            <p style="text-align:center; font-family:Optima">Email Ξενοδοχείου: ${postData[2].email}</p>
            <p style="text-align:center; font-family:Optima">Τηλέφωνο Ξενοδοχείου: ${postData[2].Phone}</p>
            <p style="text-align:center;font-family:Optima">Πόλη: ${postData[2].City}</p
            <p style="text-align:center;font-family:Optima">Κατηγορία Δωματίου: ${postData[1].Category}</p>
            <p style="text-align:center; font-family:Optima">Τιμή Δωματίου ανα Ημέρα: ${postData[1].price} € </p>
            <p style="text-align:center; font-family:Optima">Αριθμός Δωματίων: ${postData[1].amount_rooms} </p>
            <p style="text-align:center; font-family:Optima">Αριθμός Ατόμων: ${postData[1].maxPeople} </p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία Check-In: ${postData[3]} </p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία Check-Out: ${postData[4]} 
          
            
            </div>`
    
    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {

            res.send(postData)
            console.log('Email sent!!');
        }
    });
})

/*app.post('/ReservedMuseumMail',  (req, res) => {
    //Step 1
    var postData = req.body;
    console.log("Helloooooo", postData[0].firstname)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingapp@gmail.com',
            pass: 'nobingapp'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingapp@gmail.com',
        to: `${postData[0].mail},nobingapp@gmail.com`,
        cc: 'nobingapp@gmail.com',
        subject: `Η Κράτηση σας στο ${postData[1].office_name} Ολοκληρώθηκε..!!`,
        text: "Η Κράτηση Σας Ολοκληρώθηκε Με Επιτυχία..",
        html: `
        <div style="width:100%;height:auto; background-color: lightseagreen">
        <h1 style="text-align:center; font-family:verdana">Στοιχεία Κράτησης</h1>
               <h3 style="text-align:center; font-family:verdana">Στοιχεία Χρήστη</h3>
            <p style="text-align:center;font-family:Optima">Όνομα: ${postData[0].firstname}</p>
            <p style="text-align:center;font-family:Optima">Επώνυμο:${postData[0].surname}</p>
            <p style="text-align:center;font-family:Optima">Email : ${postData[0].mail}</p>
        <h3 style="text-align: center; font-family:verdana">Στοιχεία Μουσείου</h3>
            <p style="text-align:center;font-family:Optima">Όνομα Μουσείου: ${postData[1].museum_name}</p>
            <p style="text-align:center; font-family:Optima">Email Μουσείου: ${postData[1].email}</p>
            <p style="text-align:center; font-family:Optima">Τηλέφωνο Μουσείου: ${postData[1].phone}</p>
            <p style="text-align:center;font-family:Optima">Πόλη: ${postData[1].city}</p
            <p style="text-align:center;font-family:Optima">Τιμή Εισιτηρίου: ${postData[1].price} € </p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία Επίσκεψης: ${postData[2].reservDay} </p>
            </div>`

    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {

            res.send(postData)
            console.log(`Email sent to ${postData[0].mail}!!`);
        }
    });
})*/

app.post('/ReservedVehicleMail',  (req, res) => {
    //Step 1
    var postData = req.body;
    console.log("Helloooooo", postData[0].firstname)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingapp@gmail.com',
            pass: 'nobingapp'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingapp@gmail.com',
        to: `${postData[0].mail},nobingapp@gmail.com`,
        cc: 'nobingapp@gmail.com',
        subject: `Η Κράτηση σας στο ${postData[2].office_name} Ολοκληρώθηκε..!!`,
        text: "Η Κράτηση Σας Ολοκληρώθηκε Με Επιτυχία..",
        html: `
        <div style="width:100%;height:auto; background-color: rgb(212, 181, 238)">
        <h1 style="text-align:center; font-family:verdana">Στοιχεία Κράτησης</h1>
               <h3 style="text-align:center; font-family:verdana">Στοιχεία Χρήστη</h3>
            <p style="text-align:center;font-family:Optima">Όνομα: ${postData[0].firstname}</p>
            <p style="text-align:center;font-family:Optima">Επώνυμο:${postData[0].surname}</p>
            <p style="text-align:center;font-family:Optima">Email : ${postData[0].mail}</p>
        <h3 style="text-align: center; font-family:verdana">Στοιχεία Γραφείου Ενοικιάσεως Οχημάτων</h3>
            <p style="text-align:center;font-family:Optima">Όνομα Γραφείου: ${postData[2].office_name}</p>
            <p style="text-align:center; font-family:Optima">Email Γραφείου: ${postData[2].email}</p>
            <p style="text-align:center; font-family:Optima">Τηλέφωνο Γραφείου: ${postData[2].phone}</p>
            <p style="text-align:center;font-family:Optima">Πόλη: ${postData[2].City}</p
            <p style="text-align:center;font-family:Optima">Κατηγορία Οχήματος: ${postData[1].category}</p>
            <p style="text-align:center;font-family:Optima">Μάρκα Οχήματος: ${postData[1].marka} </p>
            <p style="text-align:center;font-family:Optima">Τιμή Οχήματος ανα Ημέρα: ${postData[1].price} € </p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία Check-In: ${postData[3]} </p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία Check-Out: ${postData[4]} </p>
            </div>`

    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {

            res.send(postData)
            console.log(`Email sent to ${postData[0].mail}!!`);
        }
    });
})

app.post('/ReservedMuseumMail',  (req, res) => {
    //Step 1
    var postData = req.body;
    console.log("Helloooooo", postData[0].firstname)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingapp@gmail.com',
            pass: 'nobingapp'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingapp@gmail.com',
        to: `${postData[0].mail},nobingapp@gmail.com`,
        cc: 'nobingapp@gmail.com',
        subject: `Η Κράτηση σας στο ${postData[1].museum_name} Ολοκληρώθηκε..!!`,
        text: "Η Κράτηση Σας Ολοκληρώθηκε Με Επιτυχία..",
        html: `
        <div style="width:100%;height:auto; background-color: lightseagreen">
        <h1 style="text-align:center; font-family:verdana">Στοιχεία Κράτησης</h1>
               <h3 style="text-align:center; font-family:verdana">Στοιχεία Χρήστη</h3>
            <p style="text-align:center;font-family:Optima">Όνομα: ${postData[0].firstname}</p>
            <p style="text-align:center;font-family:Optima">Επώνυμο:${postData[0].surname}</p>
            <p style="text-align:center;font-family:Optima">Email : ${postData[0].mail}</p>
        <h3 style="text-align: center; font-family:verdana">Στοιχεία Μουσείου</h3>
            <p style="text-align:center;font-family:Optima">Όνομα Μουσείου: ${postData[1].museum_name}</p>
            <p style="text-align:center; font-family:Optima">Email Μουσείου: ${postData[1].email}</p>
            <p style="text-align:center; font-family:Optima">Τηλέφωνο Μουσείου: ${postData[1].phone}</p>
            <p style="text-align:center;font-family:Optima">Πόλη: ${postData[1].city}</p
            <p style="text-align:center;font-family:Optima">Τιμή Εισιτηρίου: ${postData[1].price} € </p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία Επίσκεψης: ${postData[2]} </p>
            </div>`

    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {

            res.send(postData)
            console.log(`Email sent to ${postData[0].mail}!!`);
        }
    });
})

app.post('/ReservedRestaurantMail',  (req, res) => {
    //Step 1
    var postData = req.body;
    console.log("Helloooooo", postData[0].firstname)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingapp@gmail.com',
            pass: 'nobingapp'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingapp@gmail.com',
        to: `${postData[0].mail},nobingapp@gmail.com`,
        cc: 'nobingapp@gmail.com',
        subject: `Η Κράτηση σας στο ${postData[1].restaurant_name} Ολοκληρώθηκε..!!`,
        text: "Η Κράτηση Σας Ολοκληρώθηκε Με Επιτυχία..",
        html: `
        <div style="width:100%;height:auto; background-color: linen">
        <h1 style="text-align:center; font-family:verdana">Στοιχεία Κράτησης</h1>
               <h3 style="text-align:center; font-family:verdana">Στοιχεία Χρήστη</h3>
            <p style="text-align:center;font-family:Optima">Όνομα: ${postData[0].firstname}</p>
            <p style="text-align:center;font-family:Optima">Επώνυμο:${postData[0].surname}</p>
            <p style="text-align:center;font-family:Optima">Email : ${postData[0].mail}</p>
        <h3 style="text-align: center; font-family:verdana">Στοιχεία Εστιατορίου</h3>
            <p style="text-align:center;font-family:Optima">Όνομα Εστιατορίου: ${postData[1].restaurant_name}</p>
            <p style="text-align:center;font-family:Optima">Πόλη: ${postData[1].city}</p
            <p style="text-align:center; font-family:Optima">Τηλέφωνο Εστιατορίου: ${postData[1].phone}</p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία: ${postData[3]} </p>
            <p style="text-align:center; font-family:Optima">Αριθμός Ατόμων: ${postData[2].people} </p>
            </div>`

    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {

            res.send(postData)
            console.log(`Email sent to ${postData[0].mail}!!`);
        }
    });
})

app.post('/ReservedActivityMail',  (req, res) => {
    //Step 1
    var postData = req.body;
    console.log("Helloooooo", postData[0].firstname)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nobingapp@gmail.com',
            pass: 'nobingapp'
        }
    });
    //step 2
    let mailOptions = {
        from: 'nobingapp@gmail.com',
        to: `${postData[0].mail},nobingapp@gmail.com`,
        cc: 'nobingapp@gmail.com',
        subject: `Η Κράτηση σας στο ${postData[1].activity_name} Ολοκληρώθηκε..!!`,
        text: "Η Κράτηση Σας Ολοκληρώθηκε Με Επιτυχία..",
        html: `
        <div style="width:100%;height:auto; background-color: rgb(212, 181, 238)">
        <h1 style="text-align:center; font-family:verdana">Στοιχεία Κράτησης</h1>
               <h3 style="text-align:center; font-family:verdana">Στοιχεία Χρήστη</h3>
            <p style="text-align:center;font-family:Optima">Όνομα: ${postData[0].firstname}</p>
            <p style="text-align:center;font-family:Optima">Επώνυμο:${postData[0].surname}</p>
            <p style="text-align:center;font-family:Optima">Email : ${postData[0].mail}</p>
        <h3 style="text-align: center; font-family:verdana">Στοιχεία Δραστηριότητας</h3>
            <p style="text-align:center;font-family:Optima">Όνομα Δραστηριότητας: ${postData[1].activity_name}</p>
            <p style="text-align:center;font-family:Optima">Πόλη: ${postData[1].city}</p
            <p style="text-align:center; font-family:Optima">Τηλέφωνο Δραστηριότητας: ${postData[1].phone}</p>
            <p style="text-align:center; font-family:Optima">Ημερομηνία: ${postData[2]} </p>
            </div>`

    }
    //step 3

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {

            res.send(postData)
            console.log(`Email sent to ${postData[0].mail}!!`);
        }
    });
})

app.get('/HotelReservations', (req, res) => {
    mysqlConnection.query('select * from hotelreservation', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get('/GetRooms', (req, res) => {
    mysqlConnection.query('select * from rooms', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});

app.get('/VehicleReservations', (req, res) => {
    mysqlConnection.query('select * from vehiclereservation', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get('/ActivitiesReservations', (req, res) => {
    mysqlConnection.query('select * from activitiesreserv', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get('/RestaurantsReservations', (req, res) => {
    mysqlConnection.query('select * from restaurantreserv', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});
app.get('/MuseumsReservations', (req, res) => {
    mysqlConnection.query('select * from museumreservation', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.json(rows)
        } else {
            console.log(err);
            res.json(null)
        }
    });
});



/*app.put('/museumsUpdate',async function(req,res){
    var postData=req.body
    console.log(postData);
    mysqlConnection.query(`UPDATE MUSEUMS SET image='${postData.image}' where id_users=`)
})*/
/*
<div class="Background">
<form #form="ngForm" (ngSubmit)="ReservedHotel(data)">
<ion-card *ngIf="data2">
<div class="CardBackground">
<h1 style="text-align: center;">Στοιχεία Κράτησης</h1>
<h3 style="text-align: center;">Στοιχεία Χρήστη</h3>
<p name="userName">Όνομα: {{users.firstname}}</p>
<p name="userSurname">Επώνυμο:{{users.surname}}</p>
<p name="userMail">Email : {{users.mail}}</p>
<h3 style="text-align: center;">Στοιχεία Ξενοδοχείου</h3>
<p name="HotelName">Όνομα Ξενοδοχείου: {{data2.Hotel_name}}</p>
<p name="HotelEmail">Email Ξενοδοχείου: {{data2.email}}</p>
<p name="HotelPhone">Τηλέφωνο Ξενοδοχείου: {{data2.Phone}}</p>
<p name="HotelCity">Πόλη: {{data2.City}}</p>
<p name="RoomCategory">Κατηγορία Δωματίου: {{room.Category}}</p>
<p name="RoomPerDay">Τιμή Δωματίου ανα Ημέρα: {{room.price}} €</p>
<p name="RoomsNumber">Αριθμός Δωματίων: {{room.amount_rooms}}</p>
<p name="RoomMaxPeople">Αριθμός Ατόμων: {{room.maxPeople}}</p>
<p name="RoomCheckIn"> Ημερομηνία Check-In: {{room.CheckIn}}</p>
<p name="RoomCheckOut">Ημερομηνία Check-Out: {{room.CheckOut}}</p>
<ion-button type="submit" (click)="SendReservedMailHotel(form)" expand="block" color="dark" >Κράτηση</ion-button>
</div>
</ion-card>
</form>
</div>

hotelReservationData.userName=this.users.firstname;
  console.log("RESEULTSSSSSS: "+this.hotelReservationData)

  hotelReservationData.userSurname=this.users.surname;
   hotelReservationData.userEmail=this.users.mail;
   hotelReservationData.HotelName=this.data2.Hotel_name;
   hotelReservationData.HotelEmail=this.data2.email;
   hotelReservationData.HotelPhone=this.data2.Phone;
   hotelReservationData.HotelCity=this.data2.City;
   hotelReservationData.RoomCategory=this.room.Category;
   hotelReservationData.RoomPerDay=this.room.price;
   hotelReservationData.RoomsNumber=this.room.amount_rooms;
   hotelReservationData.RoomMaxPeople=this.room.maxPeople;
   hotelReservationData.RoomCheckIn=this.room.CheckIn;
   hotelReservationData.RoomCheckOut=this.room.CheckOut;
*/













/*app.post('/login',async function(req,res){
   const data=req.body;
   const {email,password}= data
   const queryres= await mysqlConnection.query(`SELECT (mail,User_password) FROM users WHERE mail='${email} ' `,function (err, results, fields){
      if(!err){
       console.log("Connected")
       res.json('Insert successfully');
      }else{
       console.log(err);
       }});
   }
  //create userObject and check Authentication



)*/








