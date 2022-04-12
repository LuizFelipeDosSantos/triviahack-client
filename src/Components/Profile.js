import axios from "axios";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'


export function Profile() {
    const [errorState, setErrorState] = useState();
    const [newFriend, setNewFriend] = useState("");
    const [edit, setEdit] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [userState, setUserState] = useState({username: "", avatar: "", friends: [], score: 0, });
    const [previewSource, setPreviewSource] = useState();

    /* fetch user data from server */
    useEffect(() => {
        async function fetchUser() {
          try {
            const { data } = await axios.get(`${API_BASE_URL}/user`);
            if (!data) return;
            let { username, avatar, friends, score } = data;
            if (!friends.includes(username)) {
                friends = [username];
            }
            setUserState({ username, avatar, friends, score });
          } catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
          }
        }
        fetchUser();
    }, [edit]); //runs on mount and upon change (new Avatar, add or delete friend)


   /* Toggle Form to Upload new Avatar */
    const toggleForm = () => setShowForm(!showForm);


             /* AVATAR */
    const previewFile = (event) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        changeAvatar();
    };
    
    async function changeAvatar() {
        try {
            if (!previewSource) return;
            const response = await axios.put(API_BASE_URL + "/user/edit", {avatar: previewSource});
            setEdit(!edit)
        } catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
        }
    }
 
            /* ADD FRIEND */
    function handleFriendInput(event) {
        setNewFriend(event.target.value);
    }

    async function handleNewFriendSubmit(event) {
        event.preventDefault();
        try {
            if (newFriend === "") return;
            if (userState.friends.includes(newFriend)) return;
            const response = await axios.put(API_BASE_URL + "/user/add-friend", {username: newFriend});
            console.log(response.data);
            setEdit(!edit);
            setNewFriend("")
        }
        catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
        }
    }

    async function deleteFriend(friendToDelete) {
        try {
            const response = await axios.put(API_BASE_URL + "/user/delete-friend", {username: friendToDelete});
            console.log(response.data);
            setEdit(!edit);
        }
        catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
        }
    }
    
    /* check if user is the only person inside board */
    const noFriendsAdded = userState.friends.length === 1;
    const addFriendsMessage = () => <div>Add some friends to see their score.</div>;

    return (
        <div className="profile">
            <div className="header">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <h3>{userState.username}</h3>
                <p>Score <b>{userState.score}</b></p>

         {/* if avatar dann das bild ansonsten default avatar: logo mit karten*/}

                <div className="avatarDiv" style={{ display: showForm ? 'none' : 'block' }}>
                    <img className="avatar" src={ userState.avatar} alt="avatar" />
                </div>            
                <button className="iconBtn" onClick={toggleForm}> 
                    { showForm ? <i class="material-icons-outlined md-18">keyboard_return</i> : <i class="material-icons-outlined md-18">edit</i>}
                </button>  
            </div>

            <div>
                                        
                         
                <div className="editAvatarForm" style={{ display: showForm ? 'flex' : 'none' }}>
                    
                    {previewSource && (
                        <div className="avatarDiv">
                            <img
                            className="avatar"
                            src={previewSource}
                            alt="chosen avatar"
                            />
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                    
                    {errorState && <h2>{errorState.message}</h2>}
                        <input
                        type="file"
                        name="avatar"
                        onChange={previewFile}
                        />
                        <br/>
                        <button className="iconBtn" type="submit"> 
                            <i class="material-icons-outlined md-18">save</i> 
                        </button>
                    </form>
                </div>                                    
            </div>

            <div className="friends">
            <h2>Add Friends</h2>     
            
            <form onSubmit={handleNewFriendSubmit}>
                
                {errorState && <h2 style={{ color: "#42819D" }}>{errorState.message}</h2>}

                    <input
                    type="text"
                    name="addFriend"
                    placeholder="Enter friend's username"
                    value={newFriend}
                    onChange={handleFriendInput}
                    />

                    <button className="iconBtn" type="submit"> 
                    <i class="material-icons-outlined md-18">person_add</i>
                     </button>
            </form>
            </div>

            <div className="leaderboard">
        {/* Leaderboard with my score and my freinds*/}
            <h2>Triviahack League</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Friends</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {noFriendsAdded
                    ? addFriendsMessage()
                    : userState.friends
                    .sort((a, b) => b.score - a.score)
                    .map(friend => {
                        return (
                        <tr key={nanoid()}>
                            <td>
                                <div className="avatarDiv">
                                    <img className="avatar" src={friend.avatar} alt={`${friend.username}'s avatar`}/>
                                </div>
                            </td>
                            <td>{friend.username}</td>
                            <td>{friend.score}</td>
                            <td>
                                <button className="iconBtn" onClick={() => deleteFriend(friend.username)}> <i class="material-icons-outlined md-18">delete</i> </button>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </div>
    )
}