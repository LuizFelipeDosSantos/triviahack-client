import axios from "axios";
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

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
        <div>
            <h3>Categories</h3>
            <div className="flex-list">
                {categories && 
                categories.map((category) => {
                    return (
                        <div key={category.id}>
                            <button onClick={() => {
                                navigate('/level', { state: { category, multiplayer }})
                            }}>{category.name}</button>
                        </div>
                    )
                })}
            </div>
            <h3>My Own & My Friends Quizzes</h3>
            <div className="flex-list">
                {ownFriendsQuizzes && 
                ownFriendsQuizzes.map((quiz) => {
                    return (
                        <div key={quiz._id}>
                            <button onClick={() => {
                                navigate('/level', { state: { quiz, multiplayer }})
                            }}>{quiz.name}</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}