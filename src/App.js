import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import { LayoutComponent } from './Components/LayoutComponent';
import { Custom404Page } from './Components/Custom404Page';
import { Mode } from './Components/Mode';
import { Profile } from './Components/Profile';
import { QuizList } from './Components/QuizList';
import { EditQuiz } from './Components/EditQuiz';
import { CreateQuiz } from './Components/CreateQuiz'
import { Categories } from './Components/Categories';
import { Level } from './Components/Level';
import { PlayQuiz } from './Components/PlayQuiz';
import { Room } from './Components/Room';
import { PlayQuizMultiplayer } from './Components/PlayQuizMultiplayer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Custom404Page />} />
      {/* Layout encapsulation of routes with navbar */}
      <Route element={<LayoutComponent />}>
        <Route path="/home" element={<Mode/>} />
        <Route path="/quiz">
          <Route path="list" element={<QuizList />} />
          <Route path="create" element={<CreateQuiz />} />
          <Route path="edit" element={<EditQuiz />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/room" element={<Room />}/>
        {/* toggle navbar class */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/level" element={<Level />} />
        <Route path="/quiz-single-player" element={<PlayQuiz />} />
        <Route path="/quiz-multiplayer" element={<PlayQuizMultiplayer />}/>
      </Route>
    </Routes>
  );
}


export default App;
