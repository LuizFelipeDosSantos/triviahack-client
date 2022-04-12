import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'

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
        <div className="quizList">
            <div className="header">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <h3>My Quizzes</h3>
            </div>
    
            <ul>
                {quizList &&
                    quizList.map((quiz) => {
                        return (
                            <li key={quiz._id}>
                                <h3>{quiz.name}</h3>
                                <p>- {quiz.difficulty}</p> 
                                <button className="iconBtn" onClick={ () => editQuiz(quiz._id)}> 
                                <i class="material-icons" icon>edit</i></button>
                                <button className="iconBtn" onClick={ () => deleteQuiz(quiz._id)}> 
                                <i class="material-icons">delete</i></button>
                            </li>
                        )
                    })}
            </ul>

            <button className="btn" onClick={ () => navigate("/quiz/create") }><i class="material-icons">add_circle</i><br/>Create new Quiz </button>
        </div>
    )
}