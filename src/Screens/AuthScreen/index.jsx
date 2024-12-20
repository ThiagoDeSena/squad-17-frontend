import React from "react";
import {Login} from '../../components/Auth/Login'
import { Cadastro } from "../../components/Auth/Cadastro";
export const AuthScreen = (props) => {
    return (
        <>

            {props.c === 1 && <Login/>}
            {props.c === 2 && <Cadastro/>}
        </>
    )
};