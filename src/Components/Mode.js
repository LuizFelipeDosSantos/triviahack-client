import { useNavigate } from "react-router-dom";

export function Mode() {
    const navigate = useNavigate();

    const singlePlayerGame = () => {
        navigate("/categories", { state: { multiplayer: false }});
    }

    const multiplayerGame = () => {
        navigate("/room");
    }

    return (
        <div className="flex-column">
            <h2>Select Mode</h2>
            <div>
                <button onClick={singlePlayerGame}>Single Player</button>
            </div>
            <div>
                <button onClick={multiplayerGame}>Multiplayer</button>
            </div>
        </div>
    )
}