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
    }, [quizList]); //runs on mount and changes if edit/delete quiz

    /* DELETE */
    async function deleteQuiz(quizToDelete) {
        try {
            console.log(quizToDelete)
            const response = await axios.delete(API_BASE_URL + "/quiz/delete", {params: {quizId: quizToDelete}}); //quiz ID
            console.log(response.data);
        }
        catch (err) {
            console.log(err.response.data);
            setErrorState({ message: err.response.data.errorMessage });
        }
    }

     /* EDIT: create Quiz but prefilled: component like createquiz??!!! */
     /* I already have all quiz data */
     /* to receive this data use : useLocation (level.js) */
     /* navigate(Route, { state : { function / data -- }}) */
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
                            <li key={quiz._id}>
                                <p>{quiz.name} </p>
                                <button onClick={ () => editQuiz(quiz._id)}> edit </button>
                                <button onClick={ () => deleteQuiz(quiz._id)}> delete </button>
                            </li>
                        )
                    })}
            </ul>

            {/* <button onClick={ navigate("/quiz/create") }> Create new Quiz </button> */}
            <button onClick={openEditor}> Create new Quiz </button>
        </div>
    )
}