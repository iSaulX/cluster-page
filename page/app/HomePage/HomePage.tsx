import {useState} from 'react';
import Computercard from './Computer';
export default function HomePage(){
    return(
        <div className='flex flex-row justify-between'>
            <Computercard status='ON' computerName='PC-1'/>
        </div>
    )
}

