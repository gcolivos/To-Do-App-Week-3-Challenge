var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

router.post('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        console.log("made it to app.post pool");
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {
            client.query(`INSERT INTO tasks (task, due_date, completed)
            VALUES ($1, $2, $3);`, [req.body.task, req.body.due_date, req.body.completed], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201)
                    }
                });
        }
    });
});;

router.get('/', function (req, res) {
    console.log("In get tasks thing");
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {
            console.log("got through pool to the else statement");
            client.query('SELECT * FROM tasks ORDER BY due_date ASC;', function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});

router.delete('/:id', function (req, res) {
    var taskIdToRemove = req.params.id;
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {
            client.query(`DELETE FROM tasks WHERE id=$1;`, [taskIdToRemove], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201)
                }
            });
        }
    });
});;

router.put('/:id', function (req, res) {
    var taskIdToComplete = req.params.id;
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {
            client.query(`UPDATE tasks SET completed = 'Y' WHERE id=$1;`, [taskIdToComplete], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201)
                }
            });
        }
    });
});;

module.exports = router