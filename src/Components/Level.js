import { useLocation, useNavigate } from "react-router-dom";

export function Level() {
    const navigate = useNavigate();
    const {state : { category, quiz }} = useLocation();

    return (
        <div>
            <h2>Select Difficulty</h2>
            <div className="flex-column">
                {category
                 ?  <>
                        <div>
                            <button onClick={() => {
                                navigate('/quiz', { state : { category, level: "easy"}})
                            }}>Easy</button>
                        </div>
                        <div>
                            <button onClick={() => {
                                navigate('/quiz', { state : { category, level: "medium"}})
                            }}>Medium</button>
                        </div>
                        <div>
                            <button onClick={() => {
                                navigate('/quiz', { state : { category, level: "hard"}})
                            }}>Hard</button>
                        </div>
                    </>
                 :  <div>
                        <button onClick={() => {
                                navigate('/quiz', { state : { quiz }})
                        }}>{quiz.difficulty}</button>
                    </div>}
            </div>
        </div>
    )
}