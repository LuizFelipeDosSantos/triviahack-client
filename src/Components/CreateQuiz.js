import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../consts";
import { useNavigate } from "react-router-dom";

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
        console.log(newQuiz)
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
        console.log(questionsArr.length)
        if (quizComplete) {
           try {
                const response = await axios.post(API_BASE_URL + "/quiz/create", {quiz: newQuiz, questionsArr} ); 
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
        <div>
            <h1>Create your own Quiz</h1>
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

                <br/>
                <br/>
                <button type="submit" onClick={toggleForm}> Start with the questions </button>
            </form>

            {/* ------------------------------------ */}

            <br/>

            <div style={{ display: showQuestionForm ? 'block' : 'none' }}>

            <form onSubmit={handleQuestionSubmit}>
                <label for="question">Question: </label>
                <input
                    required
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleQuestionInput}
                    placeholder="Enter a question"
                    />
                    <br/>

                {/* correct answer */}
                <label for="question">Correct Answer: </label>
                <input
                    required
                    type="text"
                    name="correct_answer"
                    value={newQuestion.correct_answer}
                    onChange={handleQuestionInput}
                    placeholder="Enter the correct answer"
                    />
                    <br/>

                {/* wrong answers */}
                <label for="incorrect_answer1">Wrong Answer 1: </label>
                <input
                    required
                    type="text"
                    name="incorrect_answer1"
                    value={newQuestion.incorrect_answer1}
                    onChange={handleQuestionInput}
                    placeholder="Enter a wrong answer"
                    />
                <br/>

                <label for="incorrect_answer2">Wrong Answer 2: </label>
                <input
                    required
                    type="text"
                    name="incorrect_answer2"
                    value={newQuestion.incorrect_answer2}
                    onChange={handleQuestionInput}
                    placeholder="Enter a wrong answer"
                    />
                <br/>

                <label for="incorrect_answer3">Wrong Answer 3: </label>
                <input
                    required
                    type="text"
                    name="incorrect_answer3"
                    value={newQuestion.incorrect_answer3}
                    onChange={handleQuestionInput}
                    placeholder="Enter a wrong answer"
                    />
                <br/>
                <br/>
                
                <button type="submit" style={{ display: quizComplete ? 'none' : 'block' }} > next </button>
         
            </form>

                {/* only appears after 10 questions filled - how about saving process in between?? submit any time and the rest is empty? pre-filled: question + number and answewr.... */}
                {/* button toggles: save or submit */}
                <br/>
                <br/>
                <button style={{ display: quizComplete ? 'block' : 'none' }} onClick={createQuiz}> Submit Quiz </button>
            </div>
        </div>
    )
}