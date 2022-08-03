const { Router, query } = require('express');
const express = require('express');
const router = express.Router();

const MySQLConnection = require('../database/database')

router.get('/getAllUsers', (req, res) => {
    MySQLConnection.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
})

router.get('/getUser/:id', (req, res) => {
    const { id } = req.params;
    MySQLConnection.query('SELECT * FROM user WHERE id = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});

//  INSERTAR USUAROS SIN CONTRASEÑA ENCRIPTADA
// router.post('/addUser', (req, res) => {
//     let userType = req.body.userType
//     let name = req.body.name
//     let email = req.body.email
//     let username = req.body.username
//     let password = req.body.password
//     MySQLConnection.query(`INSERT INTO user (userType, name, email, username, password) VALUES (${MySQLConnection.escape(req.body.userType)}, ${MySQLConnection.escape(req.body.name)}, ${MySQLConnection.escape(req.body.email)}, ${MySQLConnection.escape(req.body.username)}, ${MySQLConnection.escape(req.body.password)});`, (err, rows, fields) => {
//         if(!err){
//             res.json(rows);
//         }else{
//             console.log(err);
//         }
//     })
// });

//  INSERTAR USUARIOS
router.post('/sign-up', (req, res) => {

    MySQLConnection.query(`INSERT INTO user (userType, name, email, username, password) VALUES (${MySQLConnection.escape(req.body.userType)}, ${MySQLConnection.escape(req.body.name)}, ${MySQLConnection.escape(req.body.email)}, ${MySQLConnection.escape(req.body.username)}, ${MySQLConnection.escape(req.body.password)});`, (err, rows, fields) => {
        if (err) {
            return res.status(400).send({
                err
            });
        }
        return res.status(201).send({
            'status': 'success',
            'message': 'user registred'
        })
    })
})



router.post('/login', (req, res) => {
    MySQLConnection.query(` SELECT * FROM user WHERE user.email = ${MySQLConnection.escape(req.body['email'])} AND user.password = ${MySQLConnection.escape(req.body['password'])}; `, (err, result) => {
        if (!result) {
            return res.status(400).send({
                message: 'nombre o usuario incorrecto'
            });
        }else{
            var userType;
            var name;
            var email;
            var username;
            result.forEach(e => {
                userType = e.userType;
                name = e.name;
                email = e.email;
                username = e.username;
            });
            return res.status(200).send({
                'status': 'success', userType, name, email, username
            })
        }
    })
})

router.put('/updateUser/:id', (req, res) => {
    let id = req.params.id
    MySQLConnection.query(`UPDATE user SET userType = '${req.body.userType}', name = '${req.body.name}', email = '${req.body.email}', username = '${req.body.username}', password = '${req.body.password}' WHERE id = ${req.params.id}`, (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: "User infos updated.", rows })
        } else {
            res.status(401).json({ message: "Error when updating user infos." })
        }
    });
})

router.delete('/deleteUser/:id', (req, res) => {
    let id = req.params.id
    MySQLConnection.query(`DELETE FROM user WHERE id = '${req.params.id}'`, (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: "Usuario eliminado" })
            // res.json(rows)
        } else {
            res.status(401).json({ message: "Error when updating user infos." })
        }
    })
})

module.exports = router;