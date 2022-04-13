import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { API_BASE_URL } from "../consts";
import { AuthContext } from "../context/AuthProviderWrapper";
import { MultiPlayerContext } from "../context/MultiPlayer";
import logoIcon from '../Logo/logoIcon.png'

export function Room() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addMultiPlayerDataToContext } = useContext(MultiPlayerContext);
    const [ socket, setSocket ] = useState();
    const [ gameId, setGameId ] = useState();
    const [ mySocketId, setMySocketId ] = useState();
    const [ roomCode, setRoomCode ] = useState();
    const [ usersRoom, setUsersRoom ] = useState();
    const [ host, setHost ] = useState(false);

    useEffect(() => {
        const newsocket = io(API_BASE_URL);
        setSocket(newsocket);

        newsocket.on("newGameCreated", statusUpdate => {
            setMySocketId(statusUpdate.mySocketId);
            setGameId(statusUpdate.gameId);
        });

        newsocket.on("playerJoinedRoom", statusUpdate => {
            setUsersRoom(statusUpdate.usersRoom);
            if (mySocketId) return
            setMySocketId(statusUpdate.mySocketId);
        });

        newsocket.on("gameStarted", statusUpdate => {
            addMultiPlayerDataToContext({
                socket: newsocket,
                gameId: statusUpdate.gameId,
                usersRoom: statusUpdate.usersRoom,
                host: false,
                username: user.username,
                questions: statusUpdate.questions});
            navigate("/quiz-multiplayer", { state: statusUpdate.state });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function createRoom() {
        setHost(true);
        socket.emit("createNewGame", {username: user.username});
    }

    function joinRoom() {
        setGameId(roomCode);
        socket.emit("playerJoinGame", {gameId: roomCode, mySocketId, username: user.username});
    }

    function handleJoinGame(event) {
        setRoomCode(event.target.value);
    }

    function chooseQuiz() {
        addMultiPlayerDataToContext({socket, gameId, usersRoom, host, username: user.username});
        navigate("/categories", { state: { multiplayer: true }});
    }

    return (
        <div className="flex-column home room">
            <img className="icon" src={logoIcon} alt="triviahack logo"/>
            <button className="btn" onClick={createRoom} disabled={gameId}>
                <i class="material-icons-outlined md-18">add_circle</i><br/>Create Room
            </button>
            <br/>
            {gameId ? 
                <>
                    <h1>Room Code: {gameId}</h1>
                    {host
                     ? <h3>You are the host.<br/> Send the code to other players.</h3>
                     : <h3>Wait for host to start the game!</h3>
                    }
                    <h3> - Waiting for players to join - </h3>
                    <h3>Players Connected:</h3>
                    <div className="player">
                        {usersRoom &&
                            usersRoom.map(user => {
                            return (
                                <div key={user.username}>
                                    <p>{user.username}</p>
                                </div>
                            )
                        })}
                    </div>
                        {host &&
                            <button className="btn" onClick={chooseQuiz}>Choose Quiz & Start Game</button>
                        }
                    
                </>
             :  <>
                    <label>Enter Room Code: </label>
                    <input type="text" placeholder="Room Code" onChange={handleJoinGame}/>
                    <button className="btn" onClick={joinRoom}>Join</button>
                </>
            }
        </div>
    );
}