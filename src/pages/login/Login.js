import { useAuth } from "../../auth/Context"
//import { useNavigate } from "react-router-dom";

export default function Login() {
    let auth = useAuth();

    let onSignup = () => {
        auth.login();
    };

    return <h1>
        <button onClick={onSignup}>Sign Up using Google</button>
    </h1>
}