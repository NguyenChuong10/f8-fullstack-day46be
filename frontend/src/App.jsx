
import { BrowserRouter as Router , Routes , Route } from 'react-router'
import './App.css'
import TodoList from "./pages/TodoList"
import Navigator from './components/Navigator'
function App() {
 

  return (
    <>
        <Router>
            <Routes>
                <Route path='/' element={<Navigator/>}></Route>
                <Route path = "/todolist" element={<TodoList/>}></Route>
            </Routes>
        </Router>
    </>
  )
}

export default App
