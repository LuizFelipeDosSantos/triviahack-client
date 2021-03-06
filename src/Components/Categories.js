import axios from "axios";
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'

export function Categories() {
    const { state: { multiplayer }} = useLocation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState();
    const [ownFriendsQuizzes, setOwnFriendsQuizzes] = useState();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get(API_BASE_URL + "/categories");
                setCategories(response.data.categories);
            } catch (error) {
                console.log(error.response.data.errorMessage);
            }
        }

        async function fetchOwnFriendsQuizzes() {
            try {
                const response = await axios.get(API_BASE_URL + "/own-friends-quizzes");
                setOwnFriendsQuizzes(response.data.quizzes);
            } catch (error) {
                console.log(error.response.data.errorMessage);
            }
        }

        fetchCategories();
        fetchOwnFriendsQuizzes();
    }, []);

    return (
        <div className="cat-page">
            <div className="header">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <h3>Categories</h3>
            </div>
            <div className="cat-list">
                {categories && 
                categories.map((category) => {
                    return (
                        <div key={category.id}>
                            <button className="btn cat" 
                                    onClick={() => {
                                navigate('/level', { state: { category, multiplayer }})
                            }}>{category.name}</button>
                        </div>
                    )
                })}
            </div>

            <div className="header">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <h3>My Own & My Friends Quizzes</h3>
            </div>
            
            <div className="cat-list">
                {ownFriendsQuizzes && 
                ownFriendsQuizzes.map((quiz) => {
                    return (
                        <div key={quiz._id}>
                            <button className="btn cat" onClick={() => {
                                navigate('/level', { state: { quiz, multiplayer }})
                            }}>{quiz.name}</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}