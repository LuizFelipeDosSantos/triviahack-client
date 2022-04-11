import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

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
                console.log(response.data.questions);
                const newQuestionFormat = response.data.questions.map((question) => {
                    return {
                        question : question.question,
                        correct_answer : question.correct_answer,
                        incorrect_answer1 : question.incorrect_answers[0],
                        incorrect_answer2 : question.incorrect_answers[1],
                        incorrect_answer3 : question.incorrect_answers[2],
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
    }, []);

    /* NAME & LEVEL */
    const handleNameLevelInput = (event) => {
        setQuizEdited({
            ...quizEdited,
            [event.target.name]: event.target.value,
        });
    }
 
    /* QUESTIONS */
    const handleQuestionsInput = (event) => {
        setQuestionToEdit({
             ...questionToEdit,
            [event.target.name]: event.target.value,
        });
    } 

    const handleSubmit = (event) => {
        event.preventDefault();
        setQuestionToEdit(allQuestionsToEdit[currentQuestion]);
    }

    async function finishEdit() {
        const questions = allQuestionsToEdit.map((question) => {
            return  {
                question : question.question,
                correct_answer: question.correct_answer,
                incorrect_answers: [question.incorrect_answer1, question.incorrect_answer2, question.incorrect_answer3]
            }})
        
        try {
            const response = await axios.put(API_BASE_URL + "/quiz/edit", {quiz: quizEdited, questions });
            console.log(response.data);
            navigate("/quiz/list");
        }
        catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    return (
        <div>
            <h1> Edit this Quiz </h1>
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

            <br/>
            <br/>
            </form>

            {/* ------------------------------------ */}

            <br/>
           
            <div>
            {questionToEdit &&
                <form onSubmit={handleSubmit} >
                    <label for="question">Question: </label>
                    <input
                        type="text"
                        name="question"
                        value={questionToEdit.question}
                        onChange={handleQuestionsInput}
                        />
                        <br/>

                    <label for="question">Correct Answer: </label>
                    <input
                        required
                        type="text"
                        name="correct_answer"
                        value={questionToEdit.correct_answer}
                        onChange={handleQuestionsInput}
                        />
                        <br/>

                    <label for="incorrect_answer1">Wrong Answer 1: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer1"
                        value={questionToEdit.incorrect_answer1}
                        onChange={handleQuestionsInput}
                        />
                    <br/>

                    <label for="incorrect_answer2">Wrong Answer 2: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer2"
                        value={questionToEdit.incorrect_answer2}
                        onChange={handleQuestionsInput}
                        />
                    <br/>

                    <label for="incorrect_answer3">Wrong Answer 3: </label>
                    <input
                        required
                        type="text"
                        name="incorrect_answer3"
                        value={questionToEdit.incorrect_answer3}
                        onChange={handleQuestionsInput}
                        />
                    <br/>
                    <br/>
                    <h5>{(currentQuestion + 1) + "/" + allQuestionsToEdit.length}</h5>

                    <button type="submit" onClick={ setCurrentQuestion(currentQuestion - 1)} > previous </button>
                    <button type="submit" onClick={ setCurrentQuestion(currentQuestion + 1)} > next </button>
                    
                </form>              
            }
            </div> 
                <br/>
               <br/>
             <button onClick={finishEdit}> Submit all Changes </button>
        </div>
    )
}