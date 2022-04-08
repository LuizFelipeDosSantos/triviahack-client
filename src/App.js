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
/* import { Level } */


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Custom404Page />} />
      {/* Layout encapsulation of routes with navbar */}
      <Route element={<LayoutComponent />}>
        <Route path="/home" element={<Mode/>} />
        {/* <Route path="/level" element={<Level />} /> */}
        <Route path="/quiz">
          {/* <Route index element={<PlayQuiz />} /> */}
          <Route path="list" element={<QuizList />} />
          <Route path="create" element={<CreateQuiz />} />
          <Route path="edit/:id" element={<EditQuiz />} />
        </Route>
        <Route path="/categories" element={<Categories />} /> 
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}


export default App;
