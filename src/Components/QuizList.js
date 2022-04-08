import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

export function QuizList() {
    const [errorState, setErrorState] = useState();
    const [quizList, setQuizList] = useState([]);
    const navigate = useNavigate();
    
    /* fetch quiz data from server */
    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/quiz/list`);
                if (!data) return;
                const { quizzes } = data;
                setQuizList(quizzes);
            } catch (err) {
                console.log(err.response.data);
                setErrorState({ message: err.response.data.errorMessage });
            }
        }
        fetchQuizzes();
    }, []); //runs on mount and changes of edit/delete quiz


    /* DELETE */
    async function deleteQuiz(quizToDelete) {
        try {
            const response = await axios.delete(API_BASE_URL + "/quiz/delete", {quiz: quizToDelete}); //quiz ID
            console.log(response.data);
        }
        catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
        }
    }

     /* EDIT: create Quiz but prefilled!!! */
    async function editQuiz(quizToEdit) {
        try {
            const response = await axios.put(API_BASE_URL + "/quiz/edit", {quiz: quizToEdit }); // + questions
            console.log(response.data);
        }
        catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
        }
    }

    /* Navigate to Quiz Editor */
    const openEditor = () => {
        navigate("/quiz/create")
    }

    return (
        <div>
            <h1>My Quizzes</h1>
            <ul>
                {quizList &&
                    quizList.map((quiz) => {
                        return (
                            <li key={quiz.id}>
                                <p>{quiz.name}</p>
                                <button onClick={ editQuiz(quiz.id)}> edit </button>
                                <button onClick={ deleteQuiz(quiz.id)}> delete </button>
                            </li>
                        )
                    })}
            </ul>

            {/* <button onClick={ navigate("/quiz/create") }> Create new Quiz </button> */}
            <button onClick={openEditor}> Create new Quiz </button>
        </div>
    )
}