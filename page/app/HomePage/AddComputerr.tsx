import React from 'react';
import { Textarea, Modal, ModalBody,useDisclosure, ModalFooter, ModalContent, ModalHeader, Button } from '@nextui-org/react';
import { PressEvent } from '@react-types/shared';

export default function AddComputer(){
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return (
        <>
            <div className='rounded-full bottom-0 right-0 fixed m-5'>
            <Button onPress={onOpen}><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></Button>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose: ((e: PressEvent) => void) | undefined) => (
                        <>
                        <ModalHeader>Agrega una computadora</ModalHeader>
                        <ModalBody>
                            <Textarea placeholder='Introduce el token de acceso' label='Token de acceso' />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancelar</Button>
                            <Button color='success' onPress={onClose}>Agregar</Button>
                        </ModalFooter>
                        </>

                    )}
                </ModalContent>
            </Modal>
        </>
    )
}