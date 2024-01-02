'use client';
import { useState } from "react";
import {Button, Input, Card, CardBody} from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from "./Eyes";
import clickButton from "./LogicScript";

export default function Login(){
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible((prev) => !prev);
    return (
        <div className='flex justify-center items-center h-screen flex-col gap-5 '>
            <h1 className='text-left font-sans text-3xl font-black'>Iniciar sesion</h1>
            <Card>
                <div className='flex justify-center items-center gap-10'>
                    <CardBody className='gap-2 size-96'>
                        <Input label='Usuario' variant="bordered"/>
                        <Input
                        label="Password"
                        variant="bordered"
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
                        />
                        <Button color="primary" onClick={clickButton}> Iniciar sesion </Button>
                    </CardBody>

                    </div>
            </Card>
        </div>
    )
}