import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import { useAuthStore } from "../../lib/store/authStore";
import { Navigate } from "react-router-dom";
import Services from "../shared/Services";
import Chatbot from "../Chatbot/Chatbot";

export default function Home () {
    const { isAuthenticated, user } = useAuthStore();

    if(isAuthenticated()){
        return <Navigate to={`/${user.role}`} replace />
    }

    return (
        <div className="pt-20">
            <Header />
            <Hero />
            <About />
            <div className="p-10" id="services">
                <Services />
            </div>
            <Chatbot />
        </div>
    )
}