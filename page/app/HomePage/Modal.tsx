import { useDisclosure, Modal, ModalBody, ModalHeader, ModalFooter, Button, ModalContent } from "@nextui-org/react";
import { PressEvent } from '@react-types/shared';

export default function ModalStats(props: {isOpen: any, onOpen: any, onOpenChange: any, title: string}){
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose: ((e: PressEvent) => void) | undefined) => {
                    <>
                        <ModalHeader>{props.title}</ModalHeader>
                        <ModalBody>
                            <p>Proximamente esta feature</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cerrar</Button>
                            <Button color="success" onPress={onClose}>Aceptar</Button>
                        </ModalFooter>

                    </>
                }
                }
            </ModalContent>
        </Modal>
    )
}