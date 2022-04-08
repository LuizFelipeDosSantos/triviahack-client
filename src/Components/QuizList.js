import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../consts";


export function QuizList() {
    const [errorState, setErrorState] = useState();
    const [quizlistState, setQuizListState] = useState([]);
    
    /* fetch quiz data from server */
    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/quiz/list`);
                if (!data) return;
                const { quizzes } = data;
                setQuizListState({ quizzes });
            } catch (err) {
                console.log(err.response.data);
                setErrorState({ message: err.response.data.errorMessage });
            }
        }
        fetchQuizzes();
    }, []); //runs on mount and changes of edit/delete quiz


    return (
        <div>
            <h1>My Quizzes</h1>
            <ul>
            <li>hello</li>
             {/*    {quizlistState.map((quiz) => {
                    
                })} */}
            </ul>

            
        </div>
    )
}