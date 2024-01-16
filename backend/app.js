const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');
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

const getAllData = async() => {
    const keys = await client.keys('*');
    const computersListed = [];
    for(let i = 0; i< keys.length; i++){
        const data = await client.get(keys[i]);
        computersListed.push(JSON.parse(data));
    }
    return computersListed;
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
    const computersListed = JSON.parse(await client.get('database'));
    if (computersListed){
        res.status(200).json({message: 'Listado de computadoras', data: computersListed.database});
    } else {
        res.status(400).json({message: 'No hay computadoras registradas'});
    }
    
});

app.get('/status/:computerName', checkToken, async(req, res, next) => {
    const computerName = req.params.computerName;
    const computer = JSON.parse(await client.get(computerName));
    if (computer){
        res.status(200).json({message: 'Estado de la computadora', data: computer});
}})



app.post('/addComputer', checkToken, async (req, res, next) => {
    if (req.body.data[0]) {
        const database = await client.get('database');
        if (database){
            const data = JSON.parse(database);
            data.database.push(req.body.data[0]);
            await client.set('database', JSON.stringify(data));
            const dataSent = await client.get('database');
            res.status(200).json({message: 'Computadora agregada', data: JSON.parse(dataSent)});
        } else{
            const dataToSent = {'database': []};
            dataToSent.database.push(req.body.data[0]);
            await client.set('database', JSON.stringify(dataToSent));
        }
    } else {
        res.status(400).json({ message: 'Solicitud incorrecta' });
    }
})



app.listen(8080, () => {
    console.log('Servidor iniciado');
})