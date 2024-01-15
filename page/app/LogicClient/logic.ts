'use client';
export default function isLogedIn(): boolean {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = window.localStorage.getItem('token');
    }
    if (token) {
        return true;
    } else {
        return false;
    }
}