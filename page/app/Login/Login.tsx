'use client';
import { useState } from "react";
import {Button, Input, Card, CardBody} from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from "./Eyes";
import clickButton from "./LogicScript";
import HomePage from "../HomePage/HomePage";
import isLogedIn from "../LogicClient/logic";
export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBadLogin, setIsBadLogin] = useState(false);
    const [isLoged, setIsLoged] = useState(isLogedIn());


    const handleUsername = (e: any) => {
        setUsername(e.target.value);
    }
    const handlePassword = (e: any) => {
        setPassword(e.target.value);
    }
    const login = async () => {
        setIsLoading(true);
        setIsBadLogin(false);
        fetch('http://127.0.0.1:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        }).then((response) => {
            if(response.ok){
                setIsBadLogin(false);
                return response.json();
            } else{
                setIsBadLogin(true);
                setIsLoading(false);
            }
        })
        .then((data) => {
            if(data){
                localStorage.setItem('token', data.token);
                setIsLoading(false);
                setIsLoged(true);
            }
        }).catch((error) => {
            
            setIsLoading(false);
        });
        

    }   

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible((prev) => !prev);
    return ( isLoged ? <HomePage /> :
        <div className='flex justify-center items-center h-screen flex-col gap-5 '>
            <h1 className='text-left font-sans text-3xl font-black'>Iniciar sesion</h1>
            <Card>
                <div className='flex justify-center items-center gap-10'>
                    <CardBody className='gap-2 size-96'>
                        <Input label='Usuario' variant="bordered" onChange={handleUsername} isInvalid={isBadLogin} color={isBadLogin ? 'danger' : undefined}/>
                        <Input
                        label="Password"
                        variant="bordered"
                        onChange={handlePassword}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        className="max-w-xs w-72"
                        errorMessage={isBadLogin && "Usuario o contraseña incorrectas"}
                        isInvalid={isBadLogin}
                        color={isBadLogin ? 'danger' : undefined}
                        />
                        <Button color="primary" onClick={clickButton} isLoading={isLoading} onPress={login}> Iniciar sesion </Button>
                    </CardBody>

                    </div>
            </Card>
        </div>
    )
}