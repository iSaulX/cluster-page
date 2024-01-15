const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const dotenv = require('dotenv');
const { createInterface } = require('readline');
const { Buffer } = require('buffer');
const { redirect } = require('next/dist/server/api-utils');
const {createClient} = require('redis');


const app = express();
dotenv.config();
app.use(cors());
let tokenAuth; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_ENDPOINT,
        port: 19138
    }
});

client.connect();

client.on('connect', () => {
    console.log('Conectado a Redis');
}); 

const checkToken = (req, res, next) => {
    const hash = crypto.createHash('sha256');
    const salt = process.env.SALT;
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const textToCrypt = username + password + `${salt}`;
    hash.update(textToCrypt);
    const tokenAuth = hash.digest('hex');
    if (req.headers.authorization === tokenAuth){
        next();
    } else {
        res.status(401).json({message: 'No autorizado'});
    }
}

function generateTokenAuth(username, password){
    const hash = crypto.createHash('sha256');
    const salt = process.env.SALT;
    const textToCrypt = username + password + `${salt}`;
    hash.update(textToCrypt);
    return hash.digest('hex');
}



app.post('/login', (req, res, body) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    if (!req.body.username || !req.body.password){
        res.status(400).json({message: 'Solicitud incorrecta'});
    }
    if (req.body.username === username && req.body.password === password){
        tokenAuth = generateTokenAuth(username, password);
        res.status(200).json({message: 'Autenticación correcta', token: tokenAuth});
    } else {
        res.status(401).json({message: 'Credenciales incorrectas'});
    }
})


app.get('/computersListed', checkToken, async(req, res, next) => {
    const computersListed = [];
    client.keys('*', (err, keys) => {
        if (err) return console.log(err);
        if (keys){
            keys.forEach(key => {
                client.get(key, (err, value) => {
                    if (err) return console.log(err);
                    if (value){
                        computersListed.push(JSON.parse(value));
                    }
                })
            })
        }
    })
    res.status(200).json({message: 'Listado de computadoras', data: computersListed});
});

app.post('/addComputer', checkToken, async (req, res, next) => {
    if (req.body.data[0]) {
        const computerName = req.body.data[0].computerName;
        client.set(computerName, JSON.stringify(req.body.data[0]));
        const datas = await client.get(computerName); // Utiliza el método getAsync para obtener el valor de forma asíncrona
        res.status(200).json({ message: 'Computadora agregada correctamente', data: datas });
    } else {
        res.status(400).json({ message: 'Solicitud incorrecta' });
    }
})


app.listen(8080, () => {
    console.log('Servidor iniciado');
})