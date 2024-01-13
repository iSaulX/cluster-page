import {useState} from 'react';
import Computercard from './Computer';
import AddComputer from './AddComputerr';
import LogOut from './LogOut';

export default function HomePage(){
    return(
        <div className='p-7 flex flex-row justify-between flex-wrap'>
            <Computercard status='ON' computerName='PC-1'/>
            <Computercard status='ON' computerName='PC-1'/>
            <Computercard status='ON' computerName='PC-1'/>
            <Computercard status='ON' computerName='PC-1'/>
            <Computercard status='ON' computerName='PC-1'/>
            <Computercard status='ON' computerName='PC-1'/>
            <LogOut />
            <AddComputer />
        </div>
    )
}

