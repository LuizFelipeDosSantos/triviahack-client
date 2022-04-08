import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../consts";

export function CreateQuiz() {
    const [newQuiz, setNewQuiz] = useState({ name: "", difficulty: "" }); 
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({question: "", correct_answer: "", incorrect_answers: []})
    const toggleForm = () => setShowQuestionForm(!showQuestionForm);
    let questions = [];
    const quizComplete = questions.length === 10;

    /* QUIZ NAME & LEVEL */
    const handleQuizInput = (event) => {
        setNewQuiz({
            ...newQuiz,
            [event.target.name]: event.target.value,
        });
    }

    const handleQuizSubmit = (event) => {
        event.preventDefault();
        setShowQuestionForm(!showQuestionForm);
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
        questions.push(newQuestion);
        setNewQuestion({question: "", correct_answer: "", incorrect_answers: []});
    }

    async function createQuiz() {
        try {
            /* if last question not filled yet..return */
            /* quizComplete &&  */
            const response = await axios.post(API_BASE_URL + "/quiz/create", ); // {newQuiz + questions}
            console.log(response.data);
        }
        catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    return (
        <div>
            <h1>Create your own Quiz</h1>
            <form onSubmit={handleQuizSubmit}>

                <label for="name">Quiz-Name: </label>
                <input
                    type="text"
                    name="name"
                    value={newQuiz.name}
                    onChange={handleQuizInput}
                    placeholder="Enter a name for your quiz"
                    />

                <br/>
            
                <label for="difficulty">Level of Difficulty: </label>
                <select name="difficulty" value={newQuiz.difficulty} onChange={handleQuizInput} >
                {/* set defaultvalue? */}
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
                </select>

                <br/>
                <button type="submit" onClick={toggleForm}> Start with the questions </button>
            </form>

            {/* ------------------------------------ */}

            <br/>
            <div style={{ display: showQuestionForm ? 'none' : 'block' }} >

            <form onSubmit={handleQuestionSubmit}>
                <label for="question">Question: </label>
                <input
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
                    type="text"
                    name="correct_answer1"
                    value={newQuestion.correct_answer}
                    onChange={handleQuestionInput}
                    placeholder="Enter the correct answer"
                    />
                    <br/>

                {/* wrong answers */}
                <label for="question">Wrong Answer 1: </label>
                <input
                type="text"
                name="correct_answer1"
                value={newQuestion.incorrect_answers[0]}
                onChange={handleQuestionInput}
                placeholder="Enter the first wrong answer"
                />
                <br/>

                <label for="question">Wrong Answer 2: </label>
                <input
                type="text"
                name="correct_answer1"
                value={newQuestion.incorrect_answers[1]}
                onChange={handleQuestionInput}
                placeholder="Enter the first wrong answer"
                />
                <br/>

                <label for="question">Wrong Answer 3: </label>
                <input
                type="text"
                name="correct_answer1"
                value={newQuestion.incorrect_answers[2]}
                onChange={handleQuestionInput}
                placeholder="Enter the first wrong answer"
                />
                <br/>
                
                <button type="submit"> next </button>
         
            </form>

                {/* only appears after 10 questions filled - how about saving process in between?? submit any time and the rest is empty? pre-filled: question + number and answewr.... */}
                {/* button toggles: save or submit */}
                <button onClick={createQuiz}> Submit Quiz </button>
            </div>
        </div>
    )
}