import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'

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
                    category: category ? category.id : "",
                    difficulty: level ? level : ""
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
                return { /* green */
                    backgroundColor: "#38824e", 
                    color: "white", 
                    border: "0.4vw solid #2b613b" 
                } 
            } else { /* red */
                return {
                    backgroundColor: "#c24040", 
                    color: "white", 
                    border: "0.4vw solid #8a2d2d"
                } 
            }
        } else {
            if (answer === he.decode(questions[currentQuestion].correct_answer)) {
                return { /* green */
                    backgroundColor: "#38824e", 
                    color: "white", 
                    border: "0.4vw solid #2b613b"
                }
            }
            return {
                backgroundColor: "lightgrey", 
                color: "lightgrey", 
                border: "0.4vw solid lightgrey"
            }
        }
    }

    return (
        <div className="play">
            {(questions && answers && !quizCompleted) &&
                <>
                    <div className="header">
                        <img className="icon" src={logoIcon} alt="triviahack logo"/>
                        <h3>{quiz ? quiz.name : category.name + " - " + level}</h3>
                    </div>
                    <div className="question">
                        <h2>{he.decode(questions[currentQuestion].question)}</h2>
                    </div>
                    <div className="answers">
                        <button className="answerBtn" disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[0])}>{answers[0]}</button>
                        <button className="answerBtn" disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[1])}>{answers[1]}</button>
                        <button className="answerBtn" disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[2])}>{answers[2]}</button>
                        <button className="answerBtn" disabled={showCorrectAnswer} onClick={answerQuestion} style={answerStyles(answers[3])}>{answers[3]}</button>
                    </div>
                    <h5>{(currentQuestion + 1) + "/" + questions.length}</h5>
                </>
            }
            {quizCompleted &&
                <>
                    <h5> - QUIZ COMPLETED - </h5>
                    <h3>SCORE: {score}</h3>
                </>
            }

            
        </div>
    )
}