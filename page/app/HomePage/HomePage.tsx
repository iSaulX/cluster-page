import {useState, useEffect} from 'react';
import Computercard from './Computer';
import AddComputer from './AddComputerr';
import LogOut from './LogOut';
import SpinnerPage from './Spinner';

export default function HomePage(){
    const [isLoading, setIsLoading] = useState(true);
    const [computers, setComputers] = useState([]);
    const [error, setError] = useState(false);
    useEffect(() => {
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
                setError(true);
            }
        }).catch((error) => {
            setError(true);
            setIsLoading(false);
        })
    }, [])
    return(
        <div className='p-7 flex flex-row justify-between flex-wrap'>
            {isLoading ? <SpinnerPage/> : computers.map((computer: any) => {
                return <Computercard computerName={computer.computerName} endpoint={computer.endpoint} />
            })}
            <LogOut />
            <AddComputer />
        </div>
    )
}

