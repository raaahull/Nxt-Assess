import {useState} from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import ProtectedRoute from './components/ProtectedRoute'
import ScoreAndTimeContext from './context/ScoreAndTimeContext'
import NotFound from './components/NotFound'
import './App.css'

const App = () => {
  const [score, setScore] = useState(0)
  const [timeRemains, setTimeRemains] = useState(0)

  const scoreValue = val => {
    setScore(val)
  }

  const timeRemainingValue = time => {
    setTimeRemains(time)
  }
  return (
    <ScoreAndTimeContext.Provider
      value={{
        score,
        setScore: scoreValue,
        timeRemains,
        setTimeRemains: timeRemainingValue,
      }}
    >
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/assessment" component={Assessment} />
        <ProtectedRoute exact path="/results" component={Results} />
        <Route component={NotFound} />
      </Switch>
    </ScoreAndTimeContext.Provider>
  )
}
export default App
