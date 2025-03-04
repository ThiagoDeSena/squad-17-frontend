import emailjs from "@emailjs/browser";

export const sendEmail = async (formData) => {
    try {
        const response = await emailjs.send(
            "service_8tyd3ne",
            "template_3b8ai5m",
            formData,
            "U4GbLmK5VL34id-52"
        )
        return response.status;
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error);
        throw error;
        
    }
}