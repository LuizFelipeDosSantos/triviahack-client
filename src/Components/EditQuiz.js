import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'

export function EditQuiz() {
    const navigate = useNavigate();
    const { state: { quiz } } = useLocation();
    const [ quizEdited, setQuizEdited ] = useState(quiz);
    const [ allQuestionsToEdit, setAllQuestionsToEdit ] = useState([]);
    const [ currentQuestion, setCurrentQuestion] = useState(0);
    const [ questionToEdit, setQuestionToEdit ] = useState();

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get(API_BASE_URL + "/questions", {params: { quizId: quiz._id }});
                const newQuestionFormat = response.data.questions.map((question) => {
                    return {
                        question : question.question,
                        correct_answer : question.correct_answer,
                        incorrect_answer1 : question.incorrect_answers[0],
                        incorrect_answer2 : question.incorrect_answers[1],
                        incorrect_answer3 : question.incorrect_answers[2],
                        _id : question._id,
                    }
                })
                setAllQuestionsToEdit(newQuestionFormat);
                setQuestionToEdit(newQuestionFormat[0]);
            }
            catch (err) {
                console.log(err.response.data.errorMessage);
            } 
        }
        fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* NAME & LEVEL */
    const handleNameLevelInput = (event) => {
        setQuizEdited({
            ...quizEdited,
            [event.target.name]: event.target.value,
        });
    }
 
    /* QUESTIONS */
    const handleQuestionInput = (event) => {
        setQuestionToEdit({
             ...questionToEdit,
            [event.target.name]: event.target.value,
        });
    } 

    const previous = () => {
        if (currentQuestion >= 1) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const next = () => {
        if (currentQuestion < 9) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    function saveQuestion() {
        let newArr = [...allQuestionsToEdit];
        newArr[currentQuestion] = questionToEdit;
        setAllQuestionsToEdit(newArr);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        /* fill form with next/previous question */
        setQuestionToEdit(allQuestionsToEdit[currentQuestion]);
    }

    async function finishEdit() {
        const questions = 'allQuestionsToEdit'.map((question) => {
            return  {
                question : question.question,
                correct_answer: question.correct_answer,
                incorrect_answers: [question.incorrect_answer1, question.incorrect_answer2, question.incorrect_answer3],
                _id : question._id,
            }})
        try {
            const response = await axios.put(API_BASE_URL + "/quiz/edit", { quiz: quizEdited, questions : questions });
            console.log(response.data);
            navigate("/quiz/list");
        }
        catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    return (
        <div className="quiz quiz-edit">
            <div className="header">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <h3> Edit this Quiz </h3>
            </div>
            
            {/* Name & Level */}
            <form onSubmit={(event)=> event.preventDefault()}>
            <label for="name">Name of your Quiz: </label>
            <input
                type="text"
                name="name"
                value={quizEdited.name}
                onChange={handleNameLevelInput}
                placeholder="Enter a name for your quiz"
                />
            <br/>

            <label for="difficulty">Level of Difficulty: </label>
            <select name="difficulty" value={quizEdited.difficulty} onChange={handleNameLevelInput} >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
            </select>
            </form>

            {/* ------------------------------------ */}

            <br/>
           
            <div>
            {questionToEdit &&
                <form className="quizEditform" onSubmit={handleSubmit} >       
                    <label for="question">Question: </label>
                    <input
                        type="text"
                        name="question"
                        value={questionToEdit.question}
                        onChange={handleQuestionInput}
                        />
                    <label style={{color: "#38824e"}} for="question">Correct Answer: </label>
                    <input
                        required
                        type="text"
                        name="correct_answer"
                        value={questionToEdit.correct_answer}
                        onChange={handleQuestionInput}
                        />
                    <label style={{color: "#c24040"}} for="incorrect_answer1">Wrong Answer 1: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer1"
                        value={questionToEdit.incorrect_answer1}
                        onChange={handleQuestionInput}
                        />
                    <label style={{color: "#c24040"}} for="incorrect_answer2">Wrong Answer 2: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer2"
                        value={questionToEdit.incorrect_answer2}
                        onChange={handleQuestionInput}
                        />
                    <label style={{color: "#c24040"}} for="incorrect_answer3">Wrong Answer 3: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer3"
                        value={questionToEdit.incorrect_answer3}
                        onChange={handleQuestionInput}
                        />
                    <button className="btn" type="submit" onClick={ saveQuestion } > 
                        <i className="material-icons-outlined md-18">save</i> 
                    </button>
                    <h5>{(currentQuestion + 1) + " / " + allQuestionsToEdit.length }</h5>
                    <div>
                        <button className="btn" onClick={ previous } > {"<<"} </button>
                        <button className="btn" onClick={ next } > {">>"} </button>
                    </div>
                </form>              
            }
            </div> 
            <button className="btn" onClick={finishEdit}> Submit all Changes </button>
        </div>
    )
}