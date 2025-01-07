import axios from "axios";

const authAPI = axios.create({
    baseURL: "http://localhost:8081/auth"
});

export const registerUser = async (data) => {
    const { name, email, password, confirmPassword } = data;
    try {
        const response = await authAPI.post('/register', {
            nome: name,
            email: email,
            senha: password,
            confirmacaoSenha: confirmPassword
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return response.data.error;
    }
}


export const loginUser = async (email, senha) => {
    try {
        const response = await authAPI.post('/login', {
            login: email,
            senha: senha
        });
        const { token } = response.data;
        localStorage.setItem("jwtToken", token);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return { error: true, message: "Email ou senha incorretos." };
        }
        console.error("Erro fazer Login:", error);
        return { error: true, message: "Ocorreu um erro inesperado. Tente novamente mais tarde." };
    }
}

export const sendEmailRecoverPassword = async (email) => {
    console.log(email);
    try {
        const response = await authAPI.post(`/recover?login=${email}`);
        return response.data;
    } catch (error) {
        console.error("Error ao enviar codigo de recuperação:", error);
        return response.data.error;
    }
}

export const validateCode = async (code) => {
    console.log(code);
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