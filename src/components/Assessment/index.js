import {useState, useEffect, useContext, useCallback} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import QuestionType from '../QuestionType'
import Timer from '../Timer'
import ScoreAndTimeContext from '../../context/ScoreAndTimeContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Assessment = props => {
  const [response, setResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    total: null,
    errorMsg: null,
  })
  const [count, setCount] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const {setScore, setTimeRemains} = useContext(ScoreAndTimeContext)

  const onAnsweredQuestions = (qId, ansId) => {
    setAnsweredQuestions(prev => {
      const filtAns = prev.filter(e => e.qId !== qId)
      return [...filtAns, {qId, ansId}]
    })
  }

  const calculateScore = () => {
    let currentScore = 0
    answeredQuestions.forEach(e => {
      const question = response.data.find(q => q.id === e.qId)
      const correctAnswer = question.options.filter(
        opt => opt.isCorrect === true || opt.isCorrect === 'true',
      )

      if (e.ansId === correctAnswer[0].id) {
        currentScore += 1
      }
    })
    setScore(currentScore)
  }

  const submitAssessment = timeLeft => {
    const {history} = props
    calculateScore()
    let timeTakenToComplete
    if (timeLeft === 0) {
      timeTakenToComplete = 0
    } else {
      timeTakenToComplete = 600 - timeLeft
    }
    setTimeRemains(timeTakenToComplete)
    history.replace('/results')
  }

  const updatedData = data => {
    const questions = data.questions.map(e => {
      const {id, options_type: optionsType, question_text: questionText} = e

      let updatedOptions

      if (optionsType === 'DEFAULT') {
        updatedOptions = e.options.map(opt => ({
          id: opt.id,
          isCorrect: opt.is_correct,
          text: opt.text,
        }))
      } else if (optionsType === 'IMAGE') {
        updatedOptions = e.options.map(opt => ({
          id: opt.id,
          isCorrect: opt.is_correct,
          text: opt.text,
          imageUrl: opt.image_url,
        }))
      } else if (optionsType === 'SINGLE_SELECT') {
        updatedOptions = e.options.map(opt => ({
          id: opt.id,
          isCorrect: opt.is_correct === 'true',
          text: opt.text,
        }))
      }

      return {
        id,
        options: updatedOptions,
        optionsType,
        questionText,
      }
    })

    return questions
  }

  const getData = useCallback(async () => {
    setResponse({
      status: apiStatusConstants.inProgress,
      data: null,
      total: null,
      errorMsg: null,
    })

    const url = 'https://apis.ccbp.in/assess/questions'
    const options = {
      method: 'GET',
    }

    try {
      const res = await fetch(url, options)
      const responseData = await res.json()
      console.log('API Response: ', responseData)

      if (res.ok) {
        const data = updatedData(responseData)
        setResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.success,
          total: responseData.total,
          data,
        }))
      } else {
        setResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }))
      }
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }, [])

  useEffect(() => {
    getData()

    const handleBeforeUnload = e => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [getData])

  const onNextQuestion = () => {
    if (count < 9) {
      setCount(prevCount => prevCount + 1)
    }
  }

  const onSetQuestion = ind => {
    const selectedQuestion = response.data[ind]
    if (selectedQuestion.optionsType === 'SINGLE_SELECT') {
      const firstOption = selectedQuestion.options[0].id
      const alreadyAnswered = answeredQuestions.find(
        q => q.qId === selectedQuestion.id,
      )

      if (!alreadyAnswered) {
        setAnsweredQuestions(prev => [
          ...prev,
          {qId: selectedQuestion.id, ansId: firstOption},
        ])
        onAnsweredQuestions(selectedQuestion.id, firstOption)
      }
    }
    setCount(ind)
  }

  const renderSuccessView = () => {
    const question = response.data[count]
    return (
      <div className="question-container">
        <Timer
          response={response}
          answeredQuestions={answeredQuestions}
          onSetQuestion={onSetQuestion}
          count={count}
          submitAssessment={submitAssessment}
        />
        <QuestionType
          key={question.id}
          question={question}
          count={count}
          onNextQuestion={onNextQuestion}
          onAnsweredQuestions={onAnsweredQuestions}
          answeredQuestions={answeredQuestions}
          response={response}
        />
      </div>
    )
  }

  const renderFailureView = () => (
    <div className="err-container">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dngzbeidb/image/upload/v1727146364/ml55hvnmm1r3bw32xjtw.png"
        alt="failure view"
      />
      <h1 className="failure-head">Oops! Something went wrong</h1>
      <p className="failure-txt">We are having some trouble</p>
      <button type="button" className="retry-btn" onClick={getData}>
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  const renderAssesment = () => {
    const {status} = response
    console.log(response)

    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <div className="assessment-container">
      <Header />
      {renderAssesment()}
    </div>
  )
}

export default Assessment
