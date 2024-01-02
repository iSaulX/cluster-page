import express from 'express';
import cors from 'cors';
import os from 'os';
const app = express();
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';


dotenv.config();

let tokenAuth; 
app.use(cors());

const checkToken = (req, res, next) => {
    if (req.headers.authorization === tokenAuth){
        next();
    } else {
        res.status(401).json({message: 'No autorizado'});
    }
}

async function generateTokenAuth(username, password){
    const salt = process.env.SALT;
    const textToCrypt = username + password;
    try {
        const hash = bcrypt.hash(textToCrypt, salt);
        return hash;
    } catch (error) {
        console.log(error);
    }
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

app.post('login', (req, res, next) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    if (!req.body.username || !req.body.password){
        res.status(400).json({message: 'Solicitud incorrecta'});
    }
    if (req.body.username === username && req.body.password === password){
        token = generateTokenAuth(username, password);
        res.status(200).json({token: token});
    } else {
        res.status(401).json({message: 'Usuario o contraseña incorrectos'});
    }
});

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