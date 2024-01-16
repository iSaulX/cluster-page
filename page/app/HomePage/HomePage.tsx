import {useState, useEffect} from 'react';
import Computercard from './Computer';
import AddComputer from './AddComputerr';
import LogOut from './LogOut';
import SpinnerPage from './Spinner';
import { Computer } from './IconsHomePage';
import { ReloadIcon} from './IconsHomePage';
import { Button } from "@nextui-org/react";

export default function HomePage(){
    const [isLoading, setIsLoading] = useState(true);
    const [refreshisLoading, setRefreshIsLoading] = useState(false);
    const [computers, setComputers] = useState([]);
    const [error, setError] = useState(false);
    useEffect(() => {
       loadingData();
    }, [])
    const loadingData = () => {
        fetch('http://127.0.0.1:8080/computersListed', {
            method: 'GET',
            headers: {
                "authorization": `${localStorage.getItem('token')}`
        }}).then((response) => {
            if (response.ok){
                return response.json();
            } else {
                setError(true);
                setIsLoading(false);
            }
        }).then((data) => {
            if(data.data){
                setComputers(data.data);
                setIsLoading(false);
            } else{
                setError(true);
            }
        }).catch((error) => {
            setError(true);
            setIsLoading(false);
        })
    }
    const handleContentToShow = () =>{
        if(isLoading){
            return <SpinnerPage />
        } else if(error){
            return <div className='flex align-center items-center justify-center h-screen w-screen'>
                <h1 className='text-3xl'>Parece que no hay computadoras, empieza agregando una..</h1>
            </div>

        } else {
            return (
                <>
                    {computers.map((computers: any, key: number) => <Computercard computerName={computers.computerName} endpoint={computers.endpoint} key={key} />)}
                </>
            )
        }
    }
    return(
        <div className='p-7 flex flex-row  flex-wrap'>
            {handleContentToShow()}
            <LogOut />
            <AddComputer />
        </div>
    )
}

