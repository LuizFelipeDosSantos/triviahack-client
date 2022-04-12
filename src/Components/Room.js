import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { API_BASE_URL } from "../consts";
import { AuthContext } from "../context/AuthProviderWrapper";
import { MultiPlayerContext } from "../context/MultiPlayer";

export function Room() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addMultiPlayerDataToContext, multiplayerData } = useContext(MultiPlayerContext);
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
            if (multiplayerData) return
            console.log({
                socket: newsocket,
                gameId: statusUpdate.gameId,
                usersRoom: statusUpdate.usersRoom,
                host: false,
                username: user.username,
                questions: statusUpdate.questions});
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
        <div>
            <button onClick={createRoom} disabled={gameId}>Create Room</button>
            <br/>
            {gameId ? 
                <>
                    <h1>Room Code: {gameId}</h1>
                    {host
                     ? <h3>You are the Host!</h3>
                     : <h3>Wait to Host to Start Game!</h3>
                    }
                    <h3>Waiting for others players!</h3>
                    <h3>Players Connected:</h3>
                    {usersRoom &&
                        usersRoom.map(user => {
                        return (
                            <div key={user}>
                                <p>{user}</p>
                            </div>
                        )
                    })}
                    {host &&
                        <button onClick={chooseQuiz}>Choose Quiz & Start Game</button>
                    }
                </>
             :  <>
                    <label>Join: </label>
                    <input type="text" placeholder="Room Code" onChange={handleJoinGame}/>
                    <button onClick={joinRoom}>Join</button>
                </>
            }
        </div>
    );
}