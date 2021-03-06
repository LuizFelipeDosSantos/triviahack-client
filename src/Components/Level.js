import { useLocation, useNavigate } from "react-router-dom";
import logoIcon from '../Logo/logoIcon.png'

export function Level() {
    const navigate = useNavigate();
    const {state : { category, quiz, multiplayer }} = useLocation();

    const redirectSingleMultiPlayer = (state) => {
        if (!multiplayer) {
            navigate('/quiz-single-player', {state : state})
        } else {
            navigate('/quiz-multiplayer', {state : state});
        }
    }

    return (
        <div className="home">
            <img className="icon" src={logoIcon} alt="triviahack logo"/>
            <h2>Select Difficulty</h2>
            <div className="flex-column">
                {category
                 ?  <>
                        <div>
                            <button className="btn" onClick={() => redirectSingleMultiPlayer({ category, level: "easy"})}>Easy</button>
                        </div>
                        <div>
                            <button className="btn" onClick={() => redirectSingleMultiPlayer({ category, level: "medium"})}>Medium</button>
                        </div>
                        <div>
                            <button className="btn" onClick={() => redirectSingleMultiPlayer({ category, level: "hard"})}>Hard</button>
                        </div>
                    </>
                 :  <div>
                        <button className="btn" onClick={() => redirectSingleMultiPlayer({ quiz })}>{quiz.difficulty}</button>
                    </div>
                }
            </div>
        </div>
    )
}