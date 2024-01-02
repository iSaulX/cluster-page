'use client';

export default function isLogedIn():boolean {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    return false;
  }
}