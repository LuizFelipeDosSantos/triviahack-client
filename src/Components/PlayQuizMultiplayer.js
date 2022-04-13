import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import { AuthContext } from "../context/AuthProviderWrapper";
import { MultiPlayerContext } from "../context/MultiPlayer";
import logoIcon from '../Logo/logoIcon.png';
import timerSound from '../timer.wav';
import correctAnswerSound from '../correct-answer.wav';
import wrongAnswerSound from '../wrong-answer.wav';

export function PlayQuizMultiplayer() {
    const he = require('he');
    const navigate = useNavigate();
    const { multiplayerData, updateUsersRoom } = useContext(MultiPlayerContext);
    const { user } = useContext(AuthContext);
    const { state : { category, level, quiz } } = useLocation();
    const [ questions, setQuestions ] = useState();
    const [ currentQuestion, setCurrentQuestion] = useState(0);
    const [ answers, setAnswers ] = useState();
    const [ quizCompleted, setQuizCompleted ] = useState(false);
    const [ score, setScore ] = useState(0);
    const [ showCorrectAnswer, setShowCorrectAnswer ] = useState(false);
    const [ chosenAnswer, setChosenAnswer ] = useState("");
    const [ playersAnswered, setPlayersAnswered ] = useState(0);
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
                multiplayerData.socket.emit("startGame", {gameId: multiplayerData.gameId, questions: response.data.questions, state: { category, level, quiz }});
                setQuestions(response.data.questions);
                setAnswers(randomize([
                    he.decode(response.data.questions[0].correct_answer),
                    he.decode(response.data.questions[0].incorrect_answers[0]),
                    he.decode(response.data.questions[0].incorrect_answers[1]),
                    he.decode(response.data.questions[0].incorrect_answers[2])
                ]));
            } catch (error) {
                console.log(error);
                //console.log(error.response.data.errorMessage);
            }
        }
        if (multiplayerData.host) {
            fetchQuestions();
        } else {
            setQuestions(multiplayerData.questions);
            setAnswers(randomize([
                he.decode(multiplayerData.questions[0].correct_answer),
                he.decode(multiplayerData.questions[0].incorrect_answers[0]),
                he.decode(multiplayerData.questions[0].incorrect_answers[1]),
                he.decode(multiplayerData.questions[0].incorrect_answers[2])
            ]));
        }

        playTimerSound();

        multiplayerData.socket.on("scoreUpdated", statusUpdate => {
            updateUsersRoom(statusUpdate.usersRoom);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (playersAnswered === multiplayerData.usersRoom.length) {
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
                }
                setPlayersAnswered(0);
            }, 2000);
            return () => clearTimeout(timerShowAnswer);
        }

        multiplayerData.socket.removeEventListener("playerAnswered");
        multiplayerData.socket.on("playerAnswered", statusUpdate => {
            setPlayersAnswered(playersAnswered + 1);
        });

        /*multiplayerData.socket.removeEventListener("scoreUpdated");
        multiplayerData.socket.on("scoreUpdated", statusUpdate => {
            updateUsersRoom(statusUpdate.usersRoom);
        });*/

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playersAnswered]);

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
            setScore(score + 1);
            playCorrectAnswerSound();
            multiplayerData.socket.emit("updateScore", {
                gameId: multiplayerData.gameId, 
                username: user.username,
                score: score + 1
            });
        } else {
            playWrongAnswerSound();
        }
        setShowCorrectAnswer(!showCorrectAnswer);
        multiplayerData.socket.emit("answerQuestion", {gameId: multiplayerData.gameId});
    }

    function answerStyles(answer) {
        if (!showCorrectAnswer) return;
        if (chosenAnswer === answer) {
            if (answer === he.decode(questions[currentQuestion].correct_answer)) {
                return {
                    backgroundColor: "#38824e", 
                    color: "white", 
                    border: "0.4vw solid #2b613b" 
                }
            } else {
                return {
                    backgroundColor: "#c24040", 
                    color: "white", 
                    border: "0.4vw solid #8a2d2d"
                }
            }
        } else {
            if (answer === he.decode(questions[currentQuestion].correct_answer)) {
                return {
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

    function playAgain() {
        navigate("/room");
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
                    <h1>RANKING:</h1>
                    {[...multiplayerData.usersRoom].sort((a, b) => b.score - a.score).map(user => {
                        return (
                            <div key={user.username}>
                                <h3>{user.username + " - " + user.score}</h3>
                            </div>
                        )
                    })}
                    <button className="btn" onClick={playAgain}>Play Again</button>
                </div>
            }

            
        </div>
    )
}