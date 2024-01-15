'use client';

import { Spinner } from "@nextui-org/react";

export default function SpinnerPage(){
    return(
        <div className="flex justify-center items-center h-screen w-screen">
            <Spinner label='Cargando...' />
        </div>
    )
}