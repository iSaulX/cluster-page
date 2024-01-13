'use client';
import {useState} from 'react';
import { Textarea, Modal, ModalBody, useDisclosure, ModalFooter, ModalContent, ModalHeader, Button } from '@nextui-org/react';
import { PressEvent } from '@react-types/shared';

export default function AddComputer(){
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const handleTokenChange = (event: any) => {
        const token = atob(event.target.value);
        const JSONdata = JSON.parse(token);
        setData(JSONdata);
    }



    return (
        <>
            <div className='rounded-full bottom-0 right-0 fixed m-5 bg-blue-400'>
            <Button onPress={onOpen} className='rounded-full bg-blue-400'><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></Button>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose: ((e: PressEvent) => void) | undefined) => {
                        const registerComputer = async() => {
                            setIsLoading(true);
                            fetch('http://127.0.0.1:8081/addComputer', {
                                method: 'POST',
                                headers: {
                                    'authorization': localStorage.getItem('token')!, 
                                    'Content-Type': 'application/json',
                                }, 
                                body: JSON.stringify({data: [data]})
                            }).then((response) =>   {
                                if (response.ok){
                                    setIsLoading(false);
                                    onClose;
                                } else {
                                    setIsLoading(false);
                                    onClose;
                                }
                            })
                        }



                     return (
                        <>
                        <ModalHeader>Agrega una computadora</ModalHeader>
                        <ModalBody>
                            <Textarea placeholder='Introduce el token de acceso' onChange={handleTokenChange} label='Token de acceso' />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancelar</Button>
                            <Button color='success' onPress={registerComputer} isLoading={isLoading}>Agregar</Button>
                        </ModalFooter>
                        </>

                    )}}
                </ModalContent>
            </Modal>
        </>
    )
}