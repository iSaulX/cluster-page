import { LogOutIcon } from "./IconsHomePage";
import { useDisclosure, Modal, ModalHeader, Button, ModalBody, ModalContent, ModalFooter } from "@nextui-org/react";
import { PressEvent } from '@react-types/shared';
import { useState } from "react";

export default function LogOut(){
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const handleLogOut =  ()=>{
        setIsLoading(true);
        localStorage.removeItem('token');
        setTimeout(()=>{
            location.reload();
        }, 1000);

    }
    return (
        <>
            <div className='rounded-full top-0 right-0 fixed m-5 bg-red-800'>
            <Button onPress={onOpen} className='rounded-full bg-red-800'><LogOutIcon/></Button>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose: ((e: PressEvent) => void) | undefined) => (
                        <>
                        <ModalHeader>¿Estas seguro que quieres cerrar sesion?</ModalHeader>
                        <ModalBody>
                            Tendras que volver a iniciar sesion de nuevo
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancelar</Button>
                            <Button color='danger' onPress={handleLogOut} isLoading={isLoading}>Cerrar sesion</Button>
                        </ModalFooter>
                        </>

                    )}
                </ModalContent>
            </Modal>
        </>
    )
}