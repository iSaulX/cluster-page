const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const dotenv = require('dotenv');
const { createInterface } = require('readline');
const { Buffer } = require('buffer');
const { addHookAliases } = require('next/dist/server/require-hook');

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

function readJsonFile(){
    const data = fs.readFileSync('./status.json');
    const dataJson = JSON.parse(data);
    return dataJson;
}




function generateTokenAuth(){
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const salt = process.env.SALT;
    const textToCrypt = username + password + salt;
    const hash = crypto.createHash('sha256');
    hash.update(textToCrypt);
    return hash.digest('hex');
}

const compareToken = (req, res, next) => {
    if (req.headers.authorization === tokenAuth){
        next();
    } else {
        res.status(401).json({message: 'No autorizado'});
    }
}
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


app.use(cors());
app.use(checkToken);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checkToken);

app.get('/hits', (req, res, next) => {
    const dirname = __dirname;
    const filePath = `${dirname}/hits.csv`;
    const checkFileExits = fs.existsSync(filePath);
    if (checkFileExits){
        res.status(200).sendFile(filePath);
    } else{
        res.status(404).json({message: 'No se ha encontrado el archivo'});
    }
})



app.listen(5000, () => {
    console.log('Servidor iniciado en el puerto 5000');
});