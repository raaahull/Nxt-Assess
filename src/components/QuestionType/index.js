import {useState} from 'react'
import './index.css'

const QuestionType = ({
  question,
  count,
  onNextQuestion,
  onAnsweredQuestions,
  answeredQuestions,
  response,
}) => {
  const {questionText, options, optionsType, id} = question

  const answeredOption = answeredQuestions.find(e => e.qId === id)

  const [selectedOption, setSelectedOption] = useState(
    optionsType === 'SINGLE_SELECT' && answeredOption
      ? answeredOption.ansId
      : options[0].id,
  )

  const onClickAnswer = (q, a) => {
    setSelectedOption(a)
    onAnsweredQuestions(q, a)
  }
  const f = answeredQuestions.filter(e => e.qId === id)

  const handleNextQuestion = () => {
    const isAnswered = answeredQuestions.find(e => e.qId === id)
    if (optionsType === 'SINGLE_SELECT' && !isAnswered) {
      onClickAnswer(id, selectedOption)
    }

    onNextQuestion()
  }

  const renderOptions = () => {
    if (optionsType === 'DEFAULT') {
      return (
        <div className="options-container">
          <div className="opt-cont">
            <ul className="option-container-list">
              {options.map(e => (
                <li key={e.id} className="op-list">
                  <button
                    onClick={() => onClickAnswer(id, e.id)}
                    type="button"
                    className={`${
                      f.length > 0 && f[0].ansId === e.id ? 'selected-item' : ''
                    } list-options`}
                  >
                    {e.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {count !== response.total - 1 && (
            <button
              type="button"
              className={`${
                options.length !== 2
                  ? 'nxt-btn nxt-s'
                  : 'nxt-btn nxt-s nxt-btn-single'
              }`}
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </div>
      )
    }
    if (optionsType === 'IMAGE') {
      return (
        <div className="options-container">
          <div className="opt-cont">
            <ul className="option-container-im">
              {options.map(e => (
                <li key={e.id}>
                  <button
                    className="list-options-imgs"
                    type="button"
                    onClick={() => onClickAnswer(id, e.id)}
                  >
                    <img
                      src={e.imageUrl}
                      alt={e.text}
                      className={`${
                        f.length > 0 && f[0].ansId === e.id
                          ? 'selected-img'
                          : ''
                      } options-img`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {count !== response.total - 1 && (
            <button
              type="button"
              className="nxt-btn nxt-btn-img"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </div>
      )
    }
    if (optionsType === 'SINGLE_SELECT') {
      return (
        <ul className="options-container">
          <div className="opt-cont">
            <select
              className="list-options-select"
              value={selectedOption}
              onChange={e => onClickAnswer(id, e.target.value)}
            >
              {options.map(e => (
                <option className="option-list" key={e.id} value={e.id}>
                  {e.text}
                </option>
              ))}
            </select>
          </div>
          <div className="info-container">
            <p className="info-icon">!</p>
            <p className="info-txt">First option is selected by default</p>
          </div>
          {count !== response.total - 1 && (
            <button
              type="button"
              className="nxt-btn nxt-btn-select"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </ul>
      )
    }
    return null
  }
  return (
    <div className="question-section">
      <p className="question">
        {count + 1}. {questionText}
      </p>

      <hr className="hr-line" />
      {renderOptions()}
    </div>
  )
}

export default QuestionType
