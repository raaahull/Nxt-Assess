import {useState, useEffect} from 'react'

import './index.css'

const Timer = ({
  response,
  answeredQuestions,
  onSetQuestion,
  count,
  submitAssessment,
}) => {
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    if (timeLeft === 0) {
      return submitAssessment(timeLeft)
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft, submitAssessment])

  const onClickButton = index => {
    onSetQuestion(index)
  }
  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  const renderTimer = () => (
    <div className="timer-container">
      <p className="time-left-txt">Time Left</p>
      <p className="timer">{formatTime(timeLeft)}</p>
    </div>
  )
  const {total} = response
  const renderQuestionView = () => (
    <div className="question-view-container">
      <div className="question-view">
        <div className="count-container">
          <p className="answered-count">{answeredQuestions.length}</p>
          <p className="answered-count-txt">Answered Questions</p>
        </div>
        <div className="count-container unanswered-container">
          <p className="answered-count count-container-unanswered">
            {total - answeredQuestions.length}
          </p>
          <p className="answered-count-txt">Unanswered Questions</p>
        </div>
      </div>

      <hr className="hr-question-line" />

      <div className="question-view2">
        <h1 className="question-len">Questions ({total})</h1>
        <ul className="question-list-container">
          {response.data.map((e, index) => {
            const answered = answeredQuestions.find(each => each.qId === e.id)
            const current = count === index
            return (
              <li key={e.id}>
                <button
                  className={`${answered ? 'answered-one' : ''} ${
                    current ? 'current-one' : ''
                  } question-btn`}
                  type="button"
                  onClick={() => onClickButton(index)}
                >
                  {index + 1}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          className="submit-assessment-btn"
          type="button"
          onClick={() => submitAssessment(timeLeft)}
        >
          Submit Assessment
        </button>
      </div>
    </div>
  )

  return (
    <div className="timer-question-view-container">
      {renderTimer()}
      {renderQuestionView()}
    </div>
  )
}

export default Timer
