import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import { MultiPlayerContext } from "../context/MultiPlayer";

export function PlayQuizMultiplayer() {
    const he = require('he');
    const { multiplayerData } = useContext(MultiPlayerContext);
    const { state : { category, level, quiz } } = useLocation();
    const [ questions, setQuestions ] = useState();
    const [ currentQuestion, setCurrentQuestion] = useState(0);
    const [ answers, setAnswers ] = useState();
    const [ quizCompleted, setQuizCompleted ] = useState(false);
    const [ score, setScore ] = useState(0);
    const [ showCorrectAnswer, setShowCorrectAnswer ] = useState(false);
    const [ chosenAnswer, setChosenAnswer ] = useState("");
    const [ playersAnswered, setPlayersAnswered ] = useState(0);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get(API_BASE_URL + "/questions", { params: {
                    quizId: quiz ? quiz._id : "",
                    category: category.id,
                    difficulty: level
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
                console.log(error.response.data.errorMessage);
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
        console.log(multiplayerData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (playersAnswered === multiplayerData.usersRoom.length) {
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
            }
            setPlayersAnswered(0);
        }

        multiplayerData.socket.removeEventListener("playerAnswered");
        multiplayerData.socket.on("playerAnswered", statusUpdate => {
            setPlayersAnswered(playersAnswered + 1);
        });
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
        setChosenAnswer(event.target.outerText);
        if (event.target.outerText === he.decode(questions[currentQuestion].correct_answer)) {
            setScore(score + 1);
        }
        setShowCorrectAnswer(!showCorrectAnswer);
        multiplayerData.socket.emit("answerQuestion", {gameId: multiplayerData.gameId});
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