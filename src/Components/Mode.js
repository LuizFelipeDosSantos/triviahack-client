import { useNavigate } from "react-router-dom";
import logoIcon from '../Logo/logoIcon.png'


export function Mode() {
    const navigate = useNavigate();

    const singlePlayerGame = () => {
        navigate("/categories");
    }

    return (
        <div className="flex-column home">
            <img className="icon" src={logoIcon} alt="triviahack logo"/>
            <h2>Select Mode</h2>
            <div>
                <button className="btn" onClick={singlePlayerGame}><i class="material-icons-outlined">person</i><br/>Single-Player</button>
            </div>
            <div>
                <button className="btn"><i class="material-icons-outlined">groups</i><br/>Multi-Player</button>
            </div>
        </div>
    )
}