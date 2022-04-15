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
    const { multiplayerData, addMultiPlayerDataToContext, removeMultiPlayerDataFromContext } = useContext(MultiPlayerContext);
    const [ socket, setSocket ] = useState();
    const [ gameId, setGameId ] = useState();
    const [ mySocketId, setMySocketId ] = useState();
    const [ roomCode, setRoomCode ] = useState();
    const [ usersRoom, setUsersRoom ] = useState();
    const [ host, setHost ] = useState(false);
    const [ error, setError ] = useState("");

    useEffect(() => {
        const newsocket = !multiplayerData ? io(API_BASE_URL) : multiplayerData.socket;
        setSocket(newsocket);

        if (multiplayerData) {
            setGameId(multiplayerData.gameId);
            setUsersRoom(multiplayerData.usersRoom);
            setHost(multiplayerData.host);
        }
    
        newsocket.on("newGameCreated", statusUpdate => {
            setMySocketId(statusUpdate.mySocketId);
            setGameId(statusUpdate.gameId);
            addMultiPlayerDataToContext({...multiplayerData, socket: newsocket, gameId: statusUpdate.gameId, host: true});
        });

        newsocket.on("playerJoinedRoom", statusUpdate => {
            setUsersRoom(statusUpdate.usersRoom);
            setGameId(statusUpdate.gameId);
            setRoomCode("");
            setError("");
            addMultiPlayerDataToContext({...multiplayerData, socket: newsocket, gameId: statusUpdate.gameId, usersRoom: statusUpdate.usersRoom});
        });

        newsocket.on("playerLeavedRoom", statusUpdate => {
            setUsersRoom(statusUpdate.usersRoom);
        });
    
        newsocket.on("gameStarted", statusUpdate => {
            addMultiPlayerDataToContext({
                socket: newsocket,
                gameId: statusUpdate.gameId,
                usersRoom: statusUpdate.usersRoom,
                host: false,
                username: user.username,
                questions: statusUpdate.questions,
                avatar: user.avatar
            });
            navigate("/quiz-multiplayer", { state: statusUpdate.state });
        });

        newsocket.on("roomDeleted", () => {
            newsocket.disconnect();
            removeMultiPlayerDataFromContext();
            navigate("/home");
        });

        newsocket.on("mySocketId", statusUpdate => {
            setMySocketId(statusUpdate.mySocketId);
        });

        newsocket.on("error", statusUpdate => {
            setError(statusUpdate.errorMessage);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function createRoom() {
        socket.emit("createNewGame", {username: user.username, avatar: user.avatar});
        setHost(true);
    }

    function joinRoom() {
        socket.emit("playerJoinGame", {gameId: roomCode, mySocketId, username: user.username, avatar: user.avatar});
    }

    function handleJoinGame(event) {
        setRoomCode(event.target.value);
    }

    function chooseQuiz() {
        addMultiPlayerDataToContext({socket, gameId, usersRoom, host, username: user.username, avatar: user.avatar});
        navigate("/categories", { state: { multiplayer: true }});
    }

    function deleteRoom() {
        socket.emit("deleteRoom", {gameId});
        socket.disconnect();
        removeMultiPlayerDataFromContext();
        navigate("/home");
    }

    function leaveRoom() {
        socket.emit("playerLeaveRoom", {gameId, username: user.username});
        socket.disconnect();
        removeMultiPlayerDataFromContext();
        navigate("/home");
    }

    return (
        <div className="flex-column home room">
            <img className="icon" src={logoIcon} alt="triviahack logo"/>
            <button className="btn" onClick={createRoom} disabled={gameId}>
                <i className="material-icons-outlined md-18">add_circle</i><br/>Create Room
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
                    {host ?
                        <>
                            <button className="btn" onClick={chooseQuiz}>Choose Quiz & Start Game</button>
                            <button className="btn" onClick={deleteRoom}>Delete Room</button>
                        </>
                     :  <button className="btn" onClick={leaveRoom}>Leave Room</button>
                    }
                </>
             :  <>
                    <label>Enter Room Code: </label>
                    <input type="text" placeholder="Room Code" onChange={handleJoinGame}/>
                    <button className="btn" onClick={joinRoom}>Join</button>
                    {error !== "" &&
                        <h2 style={{ color: "red" }}>{error}</h2>
                    }
                </>
            }
        </div>
    );
}