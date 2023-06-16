const express = require('express')
const app = express()
const mysql = require('mysql2')
const cors = require('cors')

app.use(cors())
app.use(express.json())
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "testdb"
})

app.post('/create', (req, res) => {
    const task = req.body.task
    const done = req.body.done

    db.query('INSERT INTO task (task, done) VALUES (?,?)', [task, done], (err) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Tarea creada")
        }
    })
})

app.get('/tasks', (req, res) => {

    db.query('SELECT * FROM task', (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/update', (req,res) => {
    const id = req.body.id
    const done = req.body.done
    db.query("UPDATE task SET done = ? WHERE id = ?", [done, id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.delete('/delete/:id', (req,res) => {
    const id = req.params.id
    db.query("DELETE FROM task WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.listen(3001, () => {
    console.log("Servidor corriendo:)")
})

