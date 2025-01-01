import React from "react";
import { RotateSpinner } from "react-spinners-kit";

export const Loading = ({ message = "Carregando...", size = 50, color = "#F9370B" }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <RotateSpinner size={size} color={color} />
            <p className="mt-2 text-white font-poppins">{message}</p>
        </div>
    );
};

