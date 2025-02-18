import axios from "axios";

const authAPI = axios.create({
    baseURL: "http://localhost:8081/auth",
    withCredentials: true,
});

export const registerUser = async ({ name, email, password, confirmPassword }) => {
    try {
        const response = await authAPI.post('/register', {
            nome: name,
            email,
            senha: password,
            confirmacaoSenha: confirmPassword
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return { error: true, message: "Ocorreu um erro inesperado. Tente novamente mais tarde." };
    }
}


export const loginUser = async (email, senha) => {
    try {
        const response = await authAPI.post('/login', {
            login: email,
            senha: senha
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return { error: true, message: "Email ou senha incorretos." };
        }
        console.error("Erro fazer Login:", error);
        return { error: true, message: error.response.data.message };
    }
}

export const loginWithGoogle = async (token) =>{
    try {
        const response = await authAPI.post('/google', {
            idToken: token
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao logar com o Google:", error);
        return { error: true, message: error.response.data.message };
    }
}
export const sendEmailRecoverPassword = async (email) => {
    try {
        const response = await authAPI.post(`/recover?login=${email}`);
        return response.data;
    } catch (error) {
        console.error("Error ao enviar codigo de recuperação:", error);
        return response.data.error;
    }
}

export const validateCode = async (code) => {
    try {
        const response = await authAPI.post('/recover/code', {codigo: code});
        return response.data;
    } catch (error) {
        console.error("Error ao enviar codigo de recuperação:", error);
        return response.data.error;
    }
}

export const resetPassword = async (code,email, password, confirmPassword) =>{
    try {
        const response = await authAPI.post('/reset', {
            email: email,
            codigo: code,
            senha: password,
            confirmacaoSenha: confirmPassword
        })
        return response.data;
    }catch(error){
        console.error("Erro ao resetar senha:", error);
        return response.data.error;
    }
}

export const refreshToken = async (refreshToken) => {
    try{
        const response = await authAPI.post("/refresh-token", {
            refreshToken: refreshToken
        });
        const { acessToken } = response.data;
        return acessToken
    }catch(error){
        console.error("Falha ao gerar RefreshToken: " + error);
    }
}