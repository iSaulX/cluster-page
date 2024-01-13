'use client';

export default function isLogedIn():boolean{
    const token: string | null = localStorage.getItem('token');
    if(token){
        return true;
    } else {
        return false;
    }
}