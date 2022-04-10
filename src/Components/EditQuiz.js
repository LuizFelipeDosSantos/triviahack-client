import axios from "axios";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

export function EditQuiz() {
    const navigate = useNavigate();
    const { state: { quiz } } = useLocation();
    const [ quizEdited, setQuizEdited ] = useState();
    const [ allQuestionsToEdit, setAllQuestionsToEdit ] = useState([]);
    const [ questionToEdit, setQuestionToEdit ] = useState({
        question: "", 
        correct_answer: "", 
        incorrect_answer1: "",
        incorrect_answer2: "",
        incorrect_answer3: "", })


    useEffect(() => {
        async function fetchQuestions() {
            try {
                console.log(quiz._id)
                const response = await axios.get(API_BASE_URL + "/questions", {params: { quizId: quiz._id }});
                /* I do not have any category!! */
                console.log(response.data.questions);
                setAllQuestionsToEdit(response.data.questions)
            }
            catch (err) {
                console.log(err.response.data.errorMessage);
            } 
        }
        fetchQuestions();
    }, []);


    /* NAME & LEVEL */
    const handleQuizEditInput = (event) => {
        setQuizEdited({
            ...quizEdited,
            [event.target.name]: event.target.value,
        });
    }
 
    /* QUESTIONS */
    const handleQuestionEditInput = (event) => {
        setQuestionToEdit({
             ...questionToEdit,
            [event.target.name]: event.target.value,
        });
    }

    const handleQuestionEditSubmit = (event) => {
        event.preventDefault();
        setAllQuestionsToEdit([
            ...allQuestionsToEdit,
            {
            question: questionToEdit.question,
            correct_answer: questionToEdit.correct_answer,
            incorrect_answers: [questionToEdit.incorrect_answer1, questionToEdit.incorrect_answer2, questionToEdit.incorrect_answer3]
        }
        ])
        /* resetting form ...going to next in array */
    }

    async function finishEdit() {
        try {
            const response = await axios.put(API_BASE_URL + "/quiz/edit", {quiz: quizEdited, questions: allQuestionsToEdit });
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
                value={quiz.name}
                onChange={handleQuizEditInput}
                placeholder="Enter a name for your quiz"
                />

            <br/>

            <label for="difficulty">Level of Difficulty: </label>
            <select name="difficulty" value={quiz.difficulty} onChange={handleQuizEditInput} >
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
                {allQuestionsToEdit.map((question) => {
                return (
                    <form onSubmit={handleQuestionEditSubmit} key={ nanoid() }>
                        <label for="question">Question: </label>
                        <input
                            type="text"
                            name="question"
                            value={question.question}
                            onChange={handleQuestionEditInput}
                            />
                            <br/>

                        {/* correct answer */}
                        <label for="question">Correct Answer: </label>
                        <input
                            required
                            type="text"
                            name="correct_answer"
                            value={question.correct_answer}
                            onChange={handleQuestionEditInput}
                            />
                            <br/>

                        {/* wrong answers */}
                        <label for="incorrect_answer1">Wrong Answer 1: </label>
                        <input
                            required
                            type="text"
                            name="incorrect_answer1"
                            value={question.incorrect_answer[0]}
                            onChange={handleQuestionEditInput}
                            />
                        <br/>

                        <label for="incorrect_answer2">Wrong Answer 2: </label>
                        <input
                            required
                            type="text"
                            name="incorrect_answer2"
                            value={question.incorrect_answer[0]}
                            onChange={handleQuestionEditInput}
                            />
                        <br/>

                        <label for="incorrect_answer3">Wrong Answer 3: </label>
                        <input
                            required
                            type="text"
                            name="incorrect_answer3"
                            value={question.incorrect_answer[0]}
                            onChange={handleQuestionEditInput}
                            />
                        <br/>
                        <br/>

                        <button type="submit" > next </button>

                    </form>
                )
             })}
            </div>
                <br/>
                <br/>
             <button onClick={finishEdit}> Submit Edit </button>
        </div>
    )
}