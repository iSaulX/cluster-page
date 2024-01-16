'use client';
import { Computer, StopIcon, PlayIcon, StatsIcon, DownloadIcon, ConfigurationIcon, UploadIcon, ReloadIcon  } from './IconsHomePage';
import {useState, useEffect} from 'react';
import { Card, CardBody, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Button, Divider, DropdownSection, Tooltip, Skeleton, useDisclosure } from "@nextui-org/react";
import ModalStats from './Modal';

export default function Computercard(props: {computerName: string, endpoint: string}){
    const [endPoint, setEndPoint] = useState(props.endpoint);
    const [computerName, setComputerName] = useState(props.computerName);
    const [isLoading, setIsLoading] = useState(false);
    const [statusLoaded, setStatusLoaded] = useState(false);
    const [cpm, setCPM] = useState(0);
    const [percentage, setPercentage] = useState('');
    const [status, setStatus] = useState('');
    const [stopLoading, setStopLoading] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getStatusData = () =>{
        fetch(`http://127.0.0.1:8080/status/${computerName}`, {
            method: 'GET',
            headers: {
                "authorization": `${localStorage.getItem('token')}`
        }}).then((response) => {
            if (response.ok){
                return response.json();
            } else {
                setStatusLoaded(true);
                setIsLoading(false);
            }
        }).then((data) => {
            if(data.data){
                setCPM(data.data.CPM);
                setPercentage(data.data.porcentage);
                setStatus(data.data.status);
                setStatusLoaded(true);
                setIsLoading(false);
            } else{
                setStatusLoaded(true);
                setIsLoading(false);
            }
        })
    }


    useEffect(() =>{
        getStatusData();
    }, []);

    const handleRefresh = () =>{
        setIsLoading(true);
        setStatusLoaded(false);
        getStatusData();
    }


    const downloadFile = async () =>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/hits`, {
                method: 'GET',
                headers: {
                    "authorization": `${localStorage.getItem('token')}`
            }});
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "hits.txt";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.log(error);
        }
    }

    
    

     return(
        <>
        <Card isBlurred className='flex items-center justify-center flex-col m-0.5'>
            <CardBody className=' gap-5'>
                <Computer />
                <Tooltip showArrow={true} content="Recargar status" placement='top'>
                    <Button isIconOnly className='absolute top-0 left-0 m-2 p-0 ' onPress={handleRefresh} isLoading={isLoading}><ReloadIcon/></Button>
                </Tooltip>
                <h3 className='text-center'>{props.computerName}</h3>
                <Divider />
                <div className='flex flex-row justify-between items-center  p-2'>
                    <Skeleton className='rounded-lg h-10 m-2' isLoaded={statusLoaded}>
                    <p className='font-sans py-2 px-1 h-10'>CPM: <span className='text-green-500'>{cpm}</span></p>
                    </Skeleton>
                    <Divider orientation='vertical' />
                    <Skeleton className='rounded-lg h-10 m-2' isLoaded={statusLoaded}>
                    <p className='font-sans py-2 px-1 h-10'>Porcentaje: <span className='text-green-500'>{percentage}</span></p>
                    </Skeleton>
                    <Divider orientation='vertical' />
                    <Skeleton className='rounded-lg h-10 m-2' isLoaded={statusLoaded}>
                    <p className='font-sans py-2 px-1 h-10'>Status: <span className='text-green-500'>{status}</span></p>
                    </Skeleton>
                </div>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className='relative top-0 left-0'><ConfigurationIcon></ConfigurationIcon>Opciones</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownSection title={'Acciones'} showDivider>
                            <DropdownItem onPress={onOpen} description={'Regresa las estadisticas'} startContent={<StatsIcon/>}>Informacion</DropdownItem>
                            <DropdownItem onPress={downloadFile} description={'Descarga la lista de archivos exitosos'} startContent={<DownloadIcon/>}>Descargar</DropdownItem>
                            <DropdownItem description={'Sube un archivo para cargar'} startContent={<UploadIcon/>}> Subir archivo</DropdownItem>
                        </DropdownSection>
                            <DropdownSection title={'Zona de peligro'}>
                            <DropdownItem className='text-danger' description={'Detiene el proceso y descarga la lista con los combos que faltan'} startContent={<PlayIcon/>}>Detener</DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
            </CardBody>
        </Card>
        </>
    )
}