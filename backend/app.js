const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const os = require('os');
const dotenv = require('dotenv');
const { createInterface } = require('readline');
const { Buffer } = require('buffer');
const { redirect } = require('next/dist/server/api-utils');


const app = express();
dotenv.config();
app.use(cors());
let tokenAuth; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const checkToken = (req, res, next) => {
    if (req.headers.authorization === tokenAuth){
        next();
    } else {
        res.status(401).json({message: 'No autorizado'});
    }
}

function generateTokenAuth(username, password){
    const saltRounds = 10;
    const textToCrypt = username + password;
    bcrypt.hash(textToCrypt, saltRounds, (err, hash) =>{
        if (err){
            console.log(err);
        } else {
            return hash;
        }
    })
}

async function compareTokenAuth(tokenAuth, username, password){
    const salt = process.env.SALT;
    const textToCrypt = username + password;
    try {
        const hash = await bcrypt.compare(textToCrypt, tokenAuth);
        return hash;
    } catch (error) {
        console.log(error);
    }
}


function readJsonFile(filepath){
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err){
            throw new Error('Archivo no encontrado');
        } else {
            const json = JSON.parse(data);
            return json;
        }
    })
}

function writeJsonFile(filepath, content){
    fs.writeFile(filepath, JSON.stringify(content), 'utf-8', (err) => {
        if (err){
            throw new Error('Error al escribir el archivo');
        } else {
            console.log('Archivo escrito correctamente');
        }
    })
}

app.post('/login', (req, res, next) =>{
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    if (!req.body.username || !req.body.password){
        res.status(400).json({message: 'Solicitud incorrecta'});
    }
    if (req.body.username === username && req.body.password === password){
        tokenAuth = generateTokenAuth(username, password);
        res.status(200).json({message: 'Login correcto', token: tokenAuth});
    }
})


app.get('/computersListed', checkToken, (req, res, next) => {
    const computers = readJsonFile('./data.json');
    res.status(200).json({computers: computers});
});

app.post('/addComputer', checkToken, (req, res, next) => {
    if ( req.body.data ) {
        const computers = readJsonFile('./data.json');
        computers.push(req.body.data);
        writeJsonFile('./data.json', computers);
        res.status(200).json({message: 'Computadora agregada correctamente'});
    } else {
        res.status(400).json({message: 'Solicitud incorrecta'});
    }

})


app.listen(8080, () => {
    console.log('Servidor iniciado');
})