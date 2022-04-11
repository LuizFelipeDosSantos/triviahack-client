import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../consts";

export function PlayQuiz() {
    const he = require('he');
    const { state : { category, level, quiz } } = useLocation();
    const [ questions, setQuestions ] = useState();
    const [ currentQuestion, setCurrentQuestion] = useState(0);
    const [ answers, setAnswers ] = useState();
    const [ quizCompleted, setQuizCompleted ] = useState(false);
    const [ score, setScore ] = useState(0);
    const [ showCorrectAnswer, setShowCorrectAnswer ] = useState(false);
    const [ chosenAnswer, setChosenAnswer ] = useState("");

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get(API_BASE_URL + "/questions", { params: {
                    quizId: quiz ? quiz._id : "",
                    category: category.id,
                    difficulty: level
                }});
                setQuestions(response.data.questions);
                setAnswers(randomize([
                    he.decode(response.data.questions[0].correct_answer),
                    he.decode(response.data.questions[0].incorrect_answers[0]),
                    he.decode(response.data.questions[0].incorrect_answers[1]),
                    he.decode(response.data.questions[0].incorrect_answers[2])
                ]));
            } catch (error) {
                console.log(error.response.data.errorMessage);
            }
        }
        fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function fetchUpdateUserScore() {
            try {
                await axios.put(API_BASE_URL + "/user/update-score", { score });
            } catch (error) {
                console.log(error.response.data.errorMessage); 
            }
        }

        if (chosenAnswer === "") return
        const timerShowAnswer = setTimeout(() => {
            if (currentQuestion < 9) {
                setCurrentQuestion(currentQuestion + 1);
                setAnswers(randomize([
                    he.decode(questions[currentQuestion+1].correct_answer),
                    he.decode(questions[currentQuestion+1].incorrect_answers[0]),
                    he.decode(questions[currentQuestion+1].incorrect_answers[1]),
                    he.decode(questions[currentQuestion+1].incorrect_answers[2])
                ]));
                setShowCorrectAnswer(!showCorrectAnswer);
                setChosenAnswer("");
            } else {
                setQuizCompleted(!quizCompleted);
                if (!quiz) fetchUpdateUserScore();
            }
        }, 2000);
        return () => clearTimeout(timerShowAnswer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chosenAnswer]);

    function randomize(answersArray) {
        for(let i = 0; i < answersArray.length - 1; i++){
            const index = Math.floor(Math.random() * i);
            const temp = answersArray[index];
            answersArray[index] = answersArray[i];
            answersArray[i] = temp;
        }
        return answersArray;
    }

    const answerQuestion = (event) => {
        setChosenAnswer(event.target.outerText);
        if (event.target.outerText === he.decode(questions[currentQuestion].correct_answer)) {
            setScore(score + 1);
        }
        setShowCorrectAnswer(!showCorrectAnswer);
    }

    function answerStyles(answer) {
        if (!showCorrectAnswer) return;
        if (chosenAnswer === answer) {
            if (answer === he.decode(questions[currentQuestion].correct_answer)) {
                return {backgroundColor: "green"}
            } else {
                return {backgroundColor: "red"}
            }
        } else {
            if (answer === he.decode(questions[currentQuestion].correct_answer)) {
                return {backgroundColor: "green"}
            }
            return {backgroundColor: "gray"}
        }
    }

    return (
        <div>
            {(questions && answers && !quizCompleted) &&
                <>
                    <h2>{quiz ? quiz.name : category.name + " - " + level}</h2>
                    <h3>{he.decode(questions[currentQuestion].question)}</h3>
                    <div>
                        <button disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[0])}>{answers[0]}</button>
                        <button disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[1])}>{answers[1]}</button>
                        <button disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[2])}>{answers[2]}</button>
                        <button disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[3])}>{answers[3]}</button>
                    </div>
                    <h5>{(currentQuestion + 1) + "/" + questions.length}</h5>
                </>
            }
            {quizCompleted &&
                <>
                    <h2>QUIZ COMPLETED</h2>
                    <h2>SCORE: {score}</h2>
                </>
            }

            
        </div>
    )
}