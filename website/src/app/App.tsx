import { useMemo, useState } from 'react'
import { PortraitCard } from '../components/PortraitCard'
import { QuestionView } from '../components/QuestionView'
import { questions, siteCopy, totalQuestions, transitionIndex } from '../data/content'
import type { AnswerMap, AnswerValue, AppStage, QuestionRecord, RankedLeader } from '../data/schema'
import { rankAnswers, rankByLayer } from '../features/matching/engine'

function isPointAllocation(value: AnswerValue | undefined): value is Record<string, number> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isQuestionAnswered(question: QuestionRecord, value: AnswerValue | undefined): boolean {
  if (value === undefined) return false
  if (question.type === 'point-allocation') {
    if (!isPointAllocation(value)) return false
    const total = Object.values(value).reduce((sum, item) => sum + item, 0)
    return total === (question.totalPoints ?? 10)
  }
  if (question.type === 'likert-single' || question.type === 'likert-bipolar') {
    return typeof value === 'number'
  }
  return typeof value === 'string' && value.length > 0
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function buildPlaceholderReason(leader: RankedLeader, styleLeader: RankedLeader, ideologyLeader: RankedLeader): string {
  if (leader.leaderId === styleLeader.leaderId && leader.leaderId === ideologyLeader.leaderId) {
    return `${leader.leaderName} 同时在风格与理念两个层面都排在最前。${siteCopy.placeholderReason}`
  }
  return `${leader.leaderName} 是你的综合主结果；其中风格最接近 ${styleLeader.leaderName}，理念最接近 ${ideologyLeader.leaderName}。${siteCopy.placeholderReason}`
}

export function App() {
  const [stage, setStage] = useState<AppStage>('welcome')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [hasSeenTransition, setHasSeenTransition] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState<'style' | 'ideology'>('style')
  const [resultRows, setResultRows] = useState<RankedLeader[] | null>(null)

  const currentQuestion = questions[currentIndex]
  const answeredCount = useMemo(
    () => questions.filter((question) => isQuestionAnswered(question, answers[question.id])).length,
    [answers],
  )
  const progress = currentQuestion ? currentQuestion.displayNo / totalQuestions : 0
  const canAdvance = currentQuestion ? isQuestionAnswered(currentQuestion, answers[currentQuestion.id]) : false
  const isLastQuestion = currentIndex === questions.length - 1
  const overallTop = resultRows?.[0] ?? null
  const styleTop = resultRows ? rankByLayer(answers, 'style')[0] : null
  const ideologyTop = resultRows ? rankByLayer(answers, 'ideology')[0] : null
  const transitionCopy = siteCopy.transitions[transitionTarget]

  const startIntro = () => setStage('intro')
  const startQuestions = () => {
    setTransitionTarget('style')
    setStage('transition')
  }

  const goToPrevious = () => {
    if (stage === 'transition') {
      if (transitionTarget === 'style') {
        setStage('intro')
        return
      }
      setStage('question')
      setCurrentIndex(Math.max(0, transitionIndex - 1))
      return
    }
    setCurrentIndex((index) => Math.max(0, index - 1))
  }

  const openResults = () => {
    const rows = rankAnswers(answers)
    setResultRows(rows)
    setStage('results')
  }

  const goToNext = () => {
    if (!currentQuestion || !canAdvance) return

    if (isLastQuestion) {
      openResults()
      return
    }

    if (!hasSeenTransition && currentIndex + 1 === transitionIndex) {
      setHasSeenTransition(true)
      setTransitionTarget('ideology')
      setStage('transition')
      return
    }

    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
  }

  const handleAnswer = (value: AnswerValue) => {
    if (!currentQuestion) return
    const previousValue = answers[currentQuestion.id]
    const wasAnswered = isQuestionAnswered(currentQuestion, previousValue)
    const isAnsweredNow = isQuestionAnswered(currentQuestion, value)

    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))

    if (!wasAnswered && isAnsweredNow) {
      if (isLastQuestion) return

      if (!hasSeenTransition && currentIndex + 1 === transitionIndex) {
        setHasSeenTransition(true)
        setTransitionTarget('ideology')
        setStage('transition')
        return
      }

      setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
    }
  }

  const restart = () => {
    setStage('welcome')
    setCurrentIndex(0)
    setAnswers({})
    setResultRows(null)
    setHasSeenTransition(false)
    setTransitionTarget('style')
  }

  return (
    <div className="site-shell">
      <div className="background-halo background-halo-left" />
      <div className="background-halo background-halo-right" />
      <main className={`page-shell stage-${stage}`}>
        {stage === 'welcome' ? (
          <section
            className="hero-panel is-clickable"
            role="button"
            tabIndex={0}
            onClick={startIntro}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                startIntro()
              }
            }}
            aria-label="进入测评引导页"
          >
            <span className="eyebrow">Leadership Atlas / Alpha</span>
            <h1>{siteCopy.heroTitle}</h1>
            <p className="lead">{siteCopy.heroSubtitle}</p>
            <p className="body-copy">{siteCopy.heroDescription}</p>
            <div className="meta-row">
              <span>{siteCopy.estimatedDuration}</span>
              <span>
                风格 {questions.filter((question) => question.layer === 'style').length} 题 / 理念{' '}
                {questions.filter((question) => question.layer === 'ideology').length} 题
              </span>
            </div>
            <p className="hero-hint">{siteCopy.heroHint}</p>
          </section>
        ) : null}

        {stage === 'intro' ? (
          <section className="content-panel intro-panel">
            <span className="eyebrow">作答前</span>
            <h2>{siteCopy.introTitle}</h2>
            <p className="body-copy">{siteCopy.introDescription}</p>
            <div className="bullet-panel">
              {siteCopy.introBullets.map((bullet) => (
                <div key={bullet} className="bullet-item">
                  <span className="bullet-marker" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <p className="disclaimer">{siteCopy.disclaimer}</p>
            <button className="primary-button" type="button" onClick={startQuestions}>
              开始答题
            </button>
          </section>
        ) : null}

        {stage === 'transition' ? (
          <section className="content-panel transition-panel">
            <span className="eyebrow">{transitionCopy.eyebrow}</span>
            <h2>{transitionCopy.title}</h2>
            <p className="body-copy">{transitionCopy.description}</p>
            <div className="button-row">
              <button className="ghost-button" type="button" onClick={goToPrevious}>
                返回上一题
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  setStage('question')
                  setCurrentIndex(transitionTarget === 'style' ? 0 : transitionIndex)
                }}
              >
                {transitionCopy.cta}
              </button>
            </div>
          </section>
        ) : null}

        {stage === 'question' && currentQuestion ? (
          <section className="question-layout">
            <header className="question-header">
              <div>
                <span className="eyebrow">{currentQuestion.section}</span>
                <h2>
                  第 {currentQuestion.displayNo} / {totalQuestions} 题
                </h2>
              </div>
              <div className="question-progress-meta">
                <span>已完成 {answeredCount} 题</span>
                <span>{formatPercent(progress)}</span>
              </div>
            </header>

            <div className="progress-bar">
              <span style={{ width: `${progress * 100}%` }} />
            </div>

            <article className="question-card-shell">
              <div className="question-copy">
                <span className="dimension-tag">{currentQuestion.dimensionName}</span>
                <p className="question-text">{currentQuestion.prompt}</p>
              </div>

              <QuestionView
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={handleAnswer}
              />
            </article>

            <footer className="question-footer">
              <button className="ghost-button" type="button" onClick={goToPrevious} disabled={currentIndex === 0}>
                上一题
              </button>
              <p className="footer-status">
                {isQuestionAnswered(currentQuestion, answers[currentQuestion.id]) ? '答案已记录，可返回修改' : '尚未作答'}
              </p>
              <button className="primary-button" type="button" onClick={goToNext} disabled={!canAdvance}>
                {isLastQuestion ? '查看结果' : '下一题'}
              </button>
            </footer>
          </section>
        ) : null}

        {stage === 'results' && overallTop && styleTop && ideologyTop ? (
          <section className="results-layout">
            <header className="results-header">
              <span className="eyebrow">综合最像</span>
              <h2>{overallTop.leaderName}</h2>
            </header>
            <div className="results-hero">
              <PortraitCard leaderName={overallTop.leaderName} monogram={overallTop.monogram} />
              <div className="results-main-copy">
                <div className="score-strip">
                  <div>
                    <span>综合</span>
                    <strong>{formatPercent(overallTop.overall)}</strong>
                  </div>
                  <div>
                    <span>风格</span>
                    <strong>{formatPercent(overallTop.style)}</strong>
                  </div>
                  <div>
                    <span>理念</span>
                    <strong>{formatPercent(overallTop.ideology)}</strong>
                  </div>
                </div>
                <p className="body-copy">{buildPlaceholderReason(overallTop, styleTop, ideologyTop)}</p>
                <p className="disclaimer">{siteCopy.disclaimer}</p>
              </div>
            </div>

            <div className="results-secondary-grid">
              <article className="result-side-card">
                <span className="eyebrow">风格最像</span>
                <h3>{styleTop.leaderName}</h3>
              </article>
              <article className="result-side-card">
                <span className="eyebrow">理念最像</span>
                <h3>{ideologyTop.leaderName}</h3>
              </article>
            </div>

            <div className="button-row results-actions">
              <button className="ghost-button" type="button" onClick={restart}>
                重新测试
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
