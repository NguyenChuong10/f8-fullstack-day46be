
import { BrowserRouter as Router , Routes , Route } from 'react-router'
import './App.css'
import TodoList from "./pages/TodoList"
import Navigator from './components/Navigator'
function App() {
 

  return (
    <>
        <Router basename={import.meta.env.PROD ? "/f8-fullstack-day46be" : ""}>
            <Routes>
                <Route path='/' element={<Navigator/>}></Route>
                <Route path = "/todolist" element={<TodoList/>}></Route>
            </Routes>
        </Router>
    </>
  )
}

export default App
