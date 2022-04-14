import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation , useNavigate} from "react-router-dom";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png';
import timerSound from '../timer.wav';
import correctAnswerSound from '../correct-answer.wav';
import wrongAnswerSound from '../wrong-answer.wav';

export function PlayQuiz() {
    const he = require('he');
    const { state : { category, level, quiz } } = useLocation();
    const [ questions, setQuestions ] = useState();
    const [ currentQuestion, setCurrentQuestion] = useState(0);
    const [ answers, setAnswers ] = useState();
    const [ quizCompleted, setQuizCompleted ] = useState(false);
    const [ score, setScore ] = useState(0);
    const [ scoreMultiplier, setScoreMultiplier ] = useState(0);
    const [ showCorrectAnswer, setShowCorrectAnswer ] = useState(false);
    const [ chosenAnswer, setChosenAnswer ] = useState("");
    const navigate = useNavigate();
    const [ timer ] = useState(new Audio(timerSound));
    const [ correctAnswer ] = useState(new Audio(correctAnswerSound));
    const [ wrongAnswer ] = useState(new Audio(wrongAnswerSound));

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
        getScoreMultiplier();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        playTimerSound();
        return () => {stopTimerSound()};
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
                playTimerSound();
            } else {
                setQuizCompleted(!quizCompleted);
                stopTimerSound();
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
        stopTimerSound();
        setChosenAnswer(event.target.outerText);
        if (event.target.outerText === he.decode(questions[currentQuestion].correct_answer)) {
            setScore(score + scoreMultiplier);
            playCorrectAnswerSound();
        } else {
            playWrongAnswerSound();
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

    function getScoreMultiplier() {
        const difficulty = quiz ? quiz.difficulty : level;
        switch (difficulty) {
            case 'easy':
                setScoreMultiplier(1);
                break;
            case 'medium':
                setScoreMultiplier(2);
                break;
            case 'hard':
                setScoreMultiplier(3);
                break;
            default: 
                break;
        } 
    }

    function playTimerSound() {
        timer.muted = false;
        timer.volume = 0.2;
        timer.loop = true;
        timer.play();
    }

    function stopTimerSound() {
        timer.currentTime = 0;
        timer.pause();
    }

    function playCorrectAnswerSound() {
        correctAnswer.muted = false;
        correctAnswer.volume = 0.2;
        correctAnswer.play();
    }

    function playWrongAnswerSound() {
        wrongAnswer.muted = false;
        wrongAnswer.volume = 0.2;
        wrongAnswer.play();
    }

    return (
        <div className="quiz">
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
                    <h4>{(currentQuestion + 1) + " / " + questions.length}</h4>
                </>
            }
            {quizCompleted &&
                <div className="endQuiz">
                    <img className="icon" src={logoIcon} alt="triviahack logo"/>
                    <h3> - QUIZ COMPLETED - </h3>
                    <h1>SCORE: {score}</h1>
                    <button className="btn" onClick={ () => navigate("/home") }> Play again </button>
                </div>
            }

            
        </div>
    )
}