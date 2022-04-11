import { useNavigate } from "react-router-dom";
import logo2 from '../Logo/logo2.png'


export function Mode() {
    const navigate = useNavigate();

    const singlePlayerGame = () => {
        navigate("/categories");
    }

    return (
        <div className="flex-column home">
            <img className="logo" src={logo2} alt="triviahack logo"/>
            <h2>Select Mode</h2>
            <div>
                <button className="btn" onClick={singlePlayerGame}>Single-Player</button>
            </div>
            <div>
                <button className="btn" >Multi-Player</button>
            </div>
        </div>
    )
}