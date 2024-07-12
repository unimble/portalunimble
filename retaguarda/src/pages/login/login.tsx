import glogo from "../../assets/glogo.png";
import logo from "../../assets/logo.png";
import supa from "../../supabase/client";
// import { getUser } from "../../supabase/user";
import "./login.css";

export const Login = () => {

    const googleAuth = async () => {
        await supa.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://127.0.0.1:5173/retaguarda"
            }
        });
    }

    return (
        <div className="login-container">
            <section className="login">
                <img src={logo} alt="logo-unimble" width={200} className="logo" />
                <h1>Seja bem vindo</h1>
                <p>Informe suas credenciais abaixo</p>
                <button onClick={() => googleAuth()}><img src={glogo} alt="google-logo" width={40} /> Autenticação com Google</button>
            </section>
        </div >
    )
}