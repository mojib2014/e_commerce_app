const express = require("express");
const router = express.Router();
const db = require("../db");

// get all users
router.get("/", (req, res) => {
    try {
        db.query("SELECT * FROM users", [], (err, result) => {
             if(err) return res.status(400).send(err.message);
             res.send(result.rows);
         });
    } catch (error) {
        console.log(error.message);
    }
});

// get a user with a specific id
router.get("/:id", (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE id = $1";
        db.query(query, [req.params.id], (err, result) => {
            if(err) return res.status(400).send(err.message);
            res.send(result.rows[0]);
        });
    } catch (error) {
        console.log(error.message);
    }
});

// create a new user
router.post("/", (req, res) => {
    try {
        const {first_name, last_name, phone, email_address, password} = req.body;
        const insertQuery = `INSERT INTO users(first_name, last_name, phone, email_address, password)
            VALUES('${first_name}', '${last_name}', '${phone}', '${email_address}', '${password}')`;
        db.query(insertQuery, (err, result) => {
            if(err) return res.status(400).send(err.message);
            res.send(result.rows);
        });
    } catch (error) {
        console.error(error.message);
    }
});

// remove a row with a given id
router.delete("/:id", (req, res) => {
    try {
        const id = req.params.id;
        const query = `DELETE FROM users WHERE id = ${id}`;
        db.query(query, [], (err, result) => {
            if(err) return res.status(400).send(err.message);
            res.send(result.rows);
        })
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;