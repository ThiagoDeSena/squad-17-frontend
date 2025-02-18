import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const WelcomeScreen = ({ userName, onEnd }) => {
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const newConfetti = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth - window.innerWidth / 2,
            y: Math.random() * window.innerHeight - window.innerHeight / 2,
            rotate: Math.random() * 360,
            scale: Math.random() * 1.5 + 0.5,
        }));
        setConfetti(newConfetti);
    }, []);

    return (
        <div className="overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 1 }}
                className="flex items-center justify-center h-screen bg-gradient-to-b bg-neutral90 text-white font-moonjelly overflow-hidden"
            >
                {confetti.map((c) => (
                    <motion.div
                        key={c.id}
                        initial={{ x: 0, y: 0, opacity: 1, rotate: c.rotate }}
                        animate={{
                            x: c.x,
                            y: c.y,
                            opacity: 0,
                            rotate: c.rotate + 180,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)` }}
                    />
                ))}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-center"
                >
                    <img src="/images/logo.svg" alt="Logo" className="w-28 md:w-80 mx-auto" />
                    <h1 className="text-[clamp(2rem,5vw,6rem)] font-bold leading-tight">
                        Bem-vindo(a),{" "}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="text-primary80"
                        >
                            {userName.split(" ")[0]}!
                        </motion.span>
                    </h1>
                    <p className="mt-4 text-lg flex items-center justify-center">
                        Redirecionando para a plataforma...
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};
