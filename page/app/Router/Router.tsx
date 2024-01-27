import { BrowserRouter as Router, Route, Routes, redirect  } from "react-router-dom";
import Login from "../Login/Login";
import HomePage from "../HomePage/HomePage";
import { useEffect } from "react";



const RouterApp = () => {
    const isLogedIn = !!localStorage.getItem('token');
    useEffect(() => {
        if(isLogedIn){
            redirect('/home');
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomePage/> } />
            </Routes>
        </Router>
    )
}

export default RouterApp;