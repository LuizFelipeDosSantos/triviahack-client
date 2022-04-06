import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../consts';


export function Signup() {
    const navigate = useNavigate();
    const [previewSource, setPreviewSource] = useState();

    /* error also as state variable?*/

    /* state variable form input */
    const [formState, setFormState] = useState({ 
        avatar: "", 
        username: "", 
        email: "", 
        password: "" 
    });


    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        }
    }
    
    /* need that functin? or part of new user? */
    const uploadImage = (base64EncodedImage) => {
        console.log(base64EncodedImage);

    }

    function handleInput(event) {
        const file = event.target.avatar;
        previewFile(file);

        setFormState({
            ...formState, 
            [event.target.name] : event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        //if(!selectedFile) return; //if no file was uploaded, but it is not mandatory...if no selected file use default avatar
        uploadImage(previewSource);
        addNewUser(formState);
    };
    
    async function addNewUser() { /* do I pass here formState as parameter? */
        try {
            const response = await axios.post(API_BASE_URL + "/signup", formState);
            /* navigate back to login page */
            navigate("/");
        } catch (err) {
            console.error(err)
        }
    }

    return (
      <div>
            <h1>TRIVIAHACK</h1>
            <h2>Sign up </h2>
            <form onSubmit={handleSubmit}> {/* or : action method enctype? instead consts sets method and body & headers... */}
            {/*  error message */}


            {/* upload specified:  */}
                <input 
                    type="file"
                    name="avatar"
                    value={formState.avatar}
                    onChange={handleInput}
                />

                <input
                    required
                    type="text"
                    name="username"
                    value={formState.username}
                    onChange={handleInput}
                    placeholder="Enter your username"
                />

                <input
                    required
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInput}
                    placeholder="Enter your Email"
                />

                {/* how to check password pattern: twice onChange? */}

                <input
                    required
                    type="password"
                    name="password"
                    value={formState.password}
                    title="Password must contain at least 6 characters, including at least one uppercase, one lowercase and one number."
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    // onchange="this.setCustomValidity(this.validity.patternMismatch ? this.title : '');"></input>
                    // autoComplete={"new-password"}
                    onChange={handleInput}
                    placeholder="Enter your Password"
                    
                />

                <button type="submit"> Sign up </button>

            </form>

            {previewSource && (
                <img src={previewSource} alt="chosen avatar"
                style={{height: "15vh"}}
                />
            )}
        </div>
    )
}

