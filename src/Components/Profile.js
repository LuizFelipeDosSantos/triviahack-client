import axios from "axios";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "../consts";

export function Profile() {
    const [errorState, setErrorState] = useState();
    const [newFriend, setNewFriend] = useState("");
    const [edit, setEdit] = useState(false);
    const [userState, setUserState] = useState({username: "", avatar: "", friends: [], score: 0, });
    const [previewSource, setPreviewSource] = useState();

    /* fetch user data from server */
    useEffect(() => {
        async function fetchUser() {
          try {
            const { data } = await axios.get(`${API_BASE_URL}/user`);
            if (!data) return;
            const { username, avatar, friends, score } = data;
            setUserState({ username, avatar, friends, score });
          } catch (err) {
            console.log("We got an error");
            console.error(err.response.data);
          }
        }
        fetchUser();
    }, [edit]); //runs on mount and upon change


    const toggleForm = () => setEdit(!edit);


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
            console.log(response.data);
        } catch (err) {
            console.error(err)
            setErrorState(err.errorMessage);
        }
    }
 
            /* ADD FRIEND */
    function handleFriendInput(event) {
        setNewFriend(event.target.value);
    }

    async function handleNewFriendSubmit() {
        try {
            if (newFriend === "") return;
            const response = await axios.put(API_BASE_URL + "/user/add-friend", newFriend);
            console.log(response.data);
        }
        catch (err) {
            console.error(err)
            setErrorState(err.errorMessage);
        }
    }

    const noFriendsAdded = userState.friends.length === 0;
    const addFriendsMessage = () => <div>Add some friends to see their score.</div>;

    return (
        <div>
            <h2>{userState.username}</h2>
            <h3>Score: {userState.score}</h3>
            <img style={{ display: edit ? 'none' : 'block' }} src={userState.avatar} width={200} alt="avatar" />
            <br/>
            
            <div className="editAvatarForm" style={{ display: edit ? 'block' : 'none' }}>
               
                {previewSource && (
                    <img
                    src={previewSource}
                    alt="chosen avatar"
                    style={{ height: "20vh" }}
                    />
                )}
                
                    <br/>
                    <br/>
                <form onSubmit={handleSubmit}>
                
                {errorState && <h2 style={{ color: "red" }}>{errorState.errorMessage}</h2>}

                    <input
                    type="file"
                    name="avatar"
                    onChange={previewFile}
                    />
                    <br/>
                    <button type="submit"> Change to this one </button>
                </form>
            </div>
            <br/>
            <button onClick={toggleForm}> {edit ? 'Finish editing' : 'Change Avatar'} </button> 
            
            <h2>Add Friends</h2>     
            
            <form onSubmit={handleNewFriendSubmit}>
                
                {errorState && <h2 style={{ color: "red" }}>{errorState.errorMessage}</h2>}

                    <input
                    type="text"
                    name="addFriend"
                    placeholder="Enter friend's Triviahack username"
                    value={newFriend}
                    onChange={handleFriendInput}
                    />

                    <button type="submit"> Add </button>
            </form>

        {/* Leaderboard with my score and my freinds*/}
            <h2>Triviahack League</h2>
            <table>
                <thead>
                    <tr>
                        <th>Friends</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {noFriendsAdded
                    ? addFriendsMessage()
                    : userState.friends
                    .sort((a, b) => a.score - b.score)
                    .map(friend => {
                        return (
                        <tr key={nanoid()}>
                            <td>
                                <h3>{friend.username}</h3>
                            </td>
                            <td>
                                <h3>{friend.score}</h3>
                            </td>
                           <td>
                                <button> Delete </button>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}