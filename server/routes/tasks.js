var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

router.post('/', function (req, res) {
    //attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        console.log("made it to app.post pool");
        if (errorConnectingToDatabase) {
            //there was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {
            //We connected to the database!!
            //Now we are going to GET things from the DB
            client.query(`INSERT INTO tasks (task, due_date, completed)
            VALUES ($1, $2, $3);`, [req.body.task, req.body.due_date, req.body.completed], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        //query failed. Did you test it in Postico?
                        //Log the error
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201)
                    }
                });

        }
    });
});;
Stopping Point
// router.get('/', function (req, res) {
//     //attempt to connect to database
//     console.log("In get koala thing");
//     pool.connect(function (errorConnectingToDatabase, client, done) {
//         if (errorConnectingToDatabase) {
//             //there was an error connecting to the database
//             console.log('Error connecting to database', errorConnectingToDatabase);
//             res.sendStatus(500);
//         }
//         else {
//             //We connected to the database!!
//             //Now we are going to GET things from the DB
//             console.log("got through pool to the else statement");
//             client.query('SELECT * FROM koala;', function (errorMakingQuery, result) {
//                 done();
//                 if (errorMakingQuery) {
//                     //query failed. Did you test it in Postico?
//                     console.log('Error making query', errorMakingQuery);
//                     res.sendStatus(500);
//                 } else {
//                     res.send(result.rows);
//                 }
//             });
  
//         }
//     });
//   });

module.exports = router