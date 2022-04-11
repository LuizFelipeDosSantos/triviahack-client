import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

export function QuizList() {
    const [ quizList, setQuizList] = useState([]);
    const navigate = useNavigate();
    const [ listWasEdited, setListWasEdited ] = useState(false);
    
    /* fetch user's quiz data from server */
    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/quiz/list`);
                if (!data) return;
                const { quizzes } = data;
                setQuizList(quizzes);
            } catch (err) {
                console.log(err.response.data.errorMessage);
            }
        }
        fetchQuizzes();
    }, [listWasEdited]);

    /* DELETE */
    async function deleteQuiz(quizToDelete) {
        try {
            const response = await axios.delete(API_BASE_URL + "/quiz/delete", {params: {quizId: quizToDelete}}); //quiz ID
            console.log(response.data);
            setListWasEdited(!listWasEdited);
        }
        catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

     /* EDIT*/
    function editQuiz(quizIdToEdit) {
        try {
            const quiz = quizList.filter((quiz) => quiz._id === quizIdToEdit)[0];
            navigate("/quiz/edit", { state : { quiz }});
        }
        catch (err) {
            console.log(err);
        }  
    }

    return (
        <div>
            <h1>My Quizzes</h1>
            <ul>
                {quizList &&
                    quizList.map((quiz) => {
                        return (
                            <li key={quiz._id}>
                                <p>{quiz.name} - {quiz.difficulty}</p>
                                <button onClick={ () => editQuiz(quiz._id)}> edit </button>
                                <button onClick={ () => deleteQuiz(quiz._id)}> delete </button>
                            </li>
                        )
                    })}
            </ul>

            <button onClick={ () => navigate("/quiz/create") }> Create new Quiz </button>
        </div>
    )
}