import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../consts";
import { useNavigate } from "react-router-dom";
import logoIcon from '../Logo/logoIcon.png'

export function CreateQuiz() {
    const [newQuiz, setNewQuiz] = useState({ name: "", difficulty: "easy" }); 
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question: "", 
        correct_answer: "", 
        incorrect_answer1: "",
        incorrect_answer2: "",
        incorrect_answer3: "", })
    const toggleForm = () => setShowQuestionForm(!showQuestionForm);
    const [questionsArr, setQuestionsArr] = useState([]);
    const quizComplete = questionsArr.length === 10;
    const navigate = useNavigate();

    /* QUIZ NAME & LEVEL */
    const handleQuizInput = (event) => {
        setNewQuiz({
            ...newQuiz,
            [event.target.name]: event.target.value,
        });
    }

    const handleQuizSubmit = (event) => {
        event.preventDefault();
    }

    /* QUIZ QUESTIONS */
    const handleQuestionInput = (event) => {
        setNewQuestion({
             ...newQuestion,
            [event.target.name]: event.target.value,
        });
    }

    const handleQuestionSubmit = (event) => {
        event.preventDefault();
        setQuestionsArr([
            ...questionsArr,
            {
            question: newQuestion.question,
            correct_answer: newQuestion.correct_answer,
            incorrect_answers: [newQuestion.incorrect_answer1, newQuestion.incorrect_answer2, newQuestion.incorrect_answer3]
        }
        ])
        /* resetting form */
        setNewQuestion({
            question: "", 
            correct_answer: "", 
            incorrect_answer1: "", 
            incorrect_answer2: "",
            incorrect_answer3: "", 
        });
    }

    async function createQuiz() {
        if (quizComplete) {
           try {
                const response = await axios.post(API_BASE_URL + "/quiz/create", {quiz: newQuiz, questions: questionsArr, }); 
                console.log(response.data);
                setQuestionsArr([])
                navigate("/quiz/list");
            }
            catch (err) {
                console.log(err.response.data.errorMessage);
            }
        }
        return;
    }

    return (
        <div className="quiz quiz-edit">
            <div className="header">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <h3>Create your own Quiz</h3>
            </div>
            <form onSubmit={handleQuizSubmit}>
                <label for="name">Name of your Quiz: </label>
                <input
                    required
                    type="text"
                    name="name"
                    value={newQuiz.name}
                    onChange={handleQuizInput}
                    placeholder="Enter a name for your quiz"
                    />
                <br/>
                <label for="difficulty">Level of Difficulty: </label>
                <select name="difficulty" value={newQuiz.difficulty} onChange={handleQuizInput} >
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
                </select>
                <div className="quiz">
                    <button className="btn" type="submit" onClick={toggleForm}> Start </button>
                </div>
            </form>

            {/* ------------------------------------ */}

            <br/>

            <div style={{ display: showQuestionForm ? 'block' : 'none' }}>

                <form className="quizEditform" onSubmit={handleQuestionSubmit}>
                    <label for="question">Question: </label>
                    <input
                        required
                        type="text"
                        name="question"
                        value={newQuestion.question}
                        onChange={handleQuestionInput}
                        placeholder="Enter a question"
                        />
                    <label style={{color: "#38824e"}} for="question">Correct Answer: </label>
                    <input
                        required
                        type="text"
                        name="correct_answer"
                        value={newQuestion.correct_answer}
                        onChange={handleQuestionInput}
                        placeholder="Enter the correct answer"
                        />
                    <label style={{color: "#c24040"}} for="incorrect_answer1">Wrong Answer 1: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer1"
                        value={newQuestion.incorrect_answer1}
                        onChange={handleQuestionInput}
                        placeholder="Enter a wrong answer"
                        />
                    <label style={{color: "#c24040"}} for="incorrect_answer2">Wrong Answer 2: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer2"
                        value={newQuestion.incorrect_answer2}
                        onChange={handleQuestionInput}
                        placeholder="Enter a wrong answer"
                        />
                    <label style={{color: "#c24040"}} for="incorrect_answer3">Wrong Answer 3: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer3"
                        value={newQuestion.incorrect_answer3}
                        onChange={handleQuestionInput}
                        placeholder="Enter a wrong answer"
                        />
                    <button className="btn" type="submit" >{">>"}</button>
                </form>

                {/* only appears after 10 questions filled - how about saving process in between?? submit any time and the rest is empty? pre-filled: question + number and answewr.... */}
                {/* button toggles: save or submit */}
                <div className="quiz">
                    <button className="btn" style={{ display: quizComplete ? 'block' : 'none' }} onClick={createQuiz}> Submit Quiz </button>
                </div>
            </div>
        </div>
    )
}