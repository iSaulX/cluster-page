'use client';
import { Computer, StopIcon, PlayIcon, StatsIcon, DownloadIcon, ConfigurationIcon, UploadIcon  } from './IconsHomePage';
import {useState} from 'react';
import { Card, CardBody, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Button, Divider } from "@nextui-org/react";

export default function Computercard(props: any){

    return(
        <Card isBlurred className='flex items-center justify-center flex-col'>
            <CardBody className=' gap-5'>
                <Computer />
                <h3 className='text-center'>{props.computerName}</h3>
                <Divider />
                <div className='flex flex-row justify-between'>
                    <p className='font-sans p-5'>CPM: <span className='text-green-500'>100</span></p>
                    <Divider orientation='vertical' />
                    <p className='font-sans p-5'>Porcentaje: <span className='text-green-500'>10%</span></p>
                    <Divider orientation='vertical' />
                    <p className='font-sans p-5'>Estado: <span className={props.status === 'ON' ? 'text-green-500' : 'text-red-200'}></span></p>
                </div>
                <Dropdown backdrop='blur'>
                    <DropdownTrigger>
                        <Button className='relative top-0 left-0'><ConfigurationIcon></ConfigurationIcon>Opciones</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem description={'Regresa las estadisticas'} startContent={<StatsIcon/>}>Informacion</DropdownItem>
                        <DropdownItem description={'Descarga la lista de archivos exitosos'} startContent={<DownloadIcon/>}>Descargar</DropdownItem>
                        <DropdownItem description={'Sube un archivo para cargar'} startContent={<UploadIcon/>}> Subir archivo</DropdownItem>
                        <DropdownItem className='text-danger' description={'Detiene el proceso y descarga la lista con los combos que faltan'} startContent={<PlayIcon/>}>Detener</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </CardBody>
        </Card>

    )
}