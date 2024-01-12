const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const os = require('os');
const dotenv = require('dotenv');
const { createInterface } = require('readline');
const { Buffer } = require('buffer');

const app = express();

async function generateComputerToken(){
    const ip = os.networkInterfaces().eth0[0].address;
    const computerName = await getComputerName();
    const data = {'computerName': computerName, 'endpoint': ip};
    const token = Buffer.from(JSON.stringify(data)).toString('base64');
    return token;
}


function getComputerName(){
    return new Promise((resolve, reject) => {
        const readline = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.question("Introduce el nombre que le quieres dar a la computadora: ", (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

generateComputerToken().then(token => console.log(`Introduce el siguiente token en la pagina web de la computadora: ${token}`));


dotenv.config();


let tokenAuth;


function generateTokenAuth(username, password){
    const salt = process.env.SALT;
    const textToCrypt = username + password;
    try {
        const hash = bcrypt.hash(textToCrypt, salt);
        return hash;
    } catch (error) {
        console.log(error);
    }
}

function compareTokenAuth(tokenAuth, username, password){
    const salt = process.env.SALT;
    const textToCrypt = username + password;
    try {
        const hash = bcrypt.compare(textToCrypt, tokenAuth);
        return hash;
    } catch (error) {
        console.log(error);
    }
}


const checkToken = (req, res, next) => {
    if (req.headers.authorization === tokenAuth){
        next();
    } else {
        res.status(401).json({message: 'No autorizado'});
    }
}

app.use(cors());
app.use(checkToken);

