import React from "react";
import {Login} from '../../components/Auth/Login'
import { Cadastro } from "../../components/Auth/Cadastro";
import { ResetPassword } from "../../components/Auth/ResetPassword";
export const AuthScreen = (props) => {
    document.body.style.backgroundColor = '#000'
    return (
        <>

            {props.c === 1 && <Login/>}
            {props.c === 2 && <Cadastro/>}
            {props.c === 3 && <ResetPassword/>}
        </>
    )
};