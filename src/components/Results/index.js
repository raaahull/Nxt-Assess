import {useContext} from 'react'
import Header from '../Header'
import ScoreAndTimeContext from '../../context/ScoreAndTimeContext'

import './index.css'

const Results = props => {
  const {score, timeRemains} = useContext(ScoreAndTimeContext)

  const date = new Date(0)
  date.setSeconds(timeRemains)

  const timeString = date.toISOString().substring(11, 19)

  const onClickReattempt = () => {
    const {history} = props
    history.push('/assessment')
  }

  const renderResults = () => (
    <div className="result-bg-container">
      <div className="result-view">
        <img
          src="https://res.cloudinary.com/dngzbeidb/image/upload/v1727141995/sbwhkzwd0h1jzmlukaq7.png"
          alt="time up"
          className={`${timeRemains === 0 ? 'submit-img' : 'display-none'}`}
        />
        <img
          src="https://res.cloudinary.com/dngzbeidb/image/upload/v1727061621/wy0al5iuwgb1xvy4exir.png"
          alt="submit"
          className={`${timeRemains !== 0 ? 'submit-img' : 'display-none'}`}
        />
        <h1
          className={`${
            timeRemains !== 0 ? 'congrats-heading' : 'display-none'
          }`}
        >
          Congrats! You completed the assessment.
        </h1>

        <h1 className={`${timeRemains === 0 ? 'time-up' : 'display-none'}`}>
          Time is up!
        </h1>

        <div
          className={`${
            timeRemains !== 0 ? 'time-taken-container' : 'display-none'
          }`}
        >
          <p className="time-taken-txt">Time Taken:</p>
          <p className="time-taken">{timeString}</p>
        </div>

        <p className={`${timeRemains === 0 ? 'not-cmpt' : 'display-none'}`}>
          You did not complete the assessment within the time.
        </p>

        <div className="your-score-container">
          <p className="your-score-txt">Your Score:</p>
          <p className="your-score"> {score}</p>
        </div>
        <button
          className="reattempt-btn"
          data-testid="reattemptButton"
          type="button"
          onClick={onClickReattempt}
        >
          Reattempt
        </button>
      </div>
    </div>
  )
  return (
    <>
      <Header />
      {renderResults()}
    </>
  )
}

export default Results
