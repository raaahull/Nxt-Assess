import React from 'react'

const ScoreAndTimeContext = React.createContext({
  score: 0,
  setScore: () => {},
  timeRemains: 0,
  setTimeRemains: () => {},
})

export default ScoreAndTimeContext
