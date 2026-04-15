import type { AnswerValue, QuestionRecord } from '../data/schema'

type QuestionViewProps = {
  question: QuestionRecord
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}

function LikertScale({
  question,
  value,
  onChange,
  bipolar,
}: {
  question: QuestionRecord
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
  bipolar: boolean
}) {
  const selected = typeof value === 'number' ? value : undefined

  return (
    <div className="scale-block">
      <div className={`scale-labels ${bipolar ? 'is-bipolar' : ''}`}>
        <span>{question.leftLabel}</span>
        <span>{question.rightLabel}</span>
      </div>
      <div className={`scale-grid ${bipolar ? 'is-bipolar' : ''}`}>
        {Array.from({ length: 7 }, (_, index) => {
          const score = index + 1
          const isSelected = selected === score
          return (
            <button
              key={score}
              className={`scale-chip ${isSelected ? 'is-selected' : ''}`}
              type="button"
              onClick={() => onChange(score)}
            >
              <span className="scale-chip-number">{score}</span>
              {bipolar && score === 4 ? <span className="scale-chip-axis">中轴</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChoiceCards({
  question,
  value,
  onChange,
}: {
  question: QuestionRecord
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}) {
  const selected = typeof value === 'string' ? value : undefined

  return (
    <div className="choice-grid">
      {question.options.map((option) => {
        const isSelected = selected === option.id
        return (
          <button
            key={option.id}
            type="button"
            className={`choice-card ${isSelected ? 'is-selected' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <span className="choice-label">{option.label}</span>
            <span className="choice-text">{option.text}</span>
          </button>
        )
      })}
    </div>
  )
}

function PointAllocation({
  question,
  value,
  onChange,
}: {
  question: QuestionRecord
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}) {
  const current = typeof value === 'object' && value && !Array.isArray(value) ? (value as Record<string, number>) : {}
  const totalPoints = question.totalPoints ?? 10
  const spent = question.options.reduce((sum, option) => sum + (current[option.id] ?? 0), 0)
  const remaining = totalPoints - spent

  const updateOption = (optionId: string, delta: number) => {
    const currentValue = current[optionId] ?? 0
    const nextValue = Math.max(0, currentValue + delta)
    const draft = { ...current, [optionId]: nextValue }
    const draftSpent = question.options.reduce((sum, option) => sum + (draft[option.id] ?? 0), 0)
    if (draftSpent > totalPoints) return
    onChange(draft)
  }

  return (
    <div className="allocation-block">
      <div className="allocation-summary">
        <span>总分：{totalPoints}</span>
        <strong>剩余：{remaining}</strong>
      </div>
      <div className="allocation-grid">
        {question.options.map((option) => {
          const score = current[option.id] ?? 0
          return (
            <div key={option.id} className="allocation-card">
              <div>
                <span className="choice-label">{option.label}</span>
                <p className="allocation-text">{option.text}</p>
              </div>
              <div className="allocation-controls">
                <button type="button" onClick={() => updateOption(option.id, -1)}>
                  -
                </button>
                <span>{score}</span>
                <button type="button" onClick={() => updateOption(option.id, 1)}>
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function QuestionView({ question, value, onChange }: QuestionViewProps) {
  if (question.type === 'likert-single') {
    return <LikertScale question={question} value={value} onChange={onChange} bipolar={false} />
  }

  if (question.type === 'likert-bipolar') {
    return <LikertScale question={question} value={value} onChange={onChange} bipolar />
  }

  if (question.type === 'point-allocation') {
    return <PointAllocation question={question} value={value} onChange={onChange} />
  }

  return <ChoiceCards question={question} value={value} onChange={onChange} />
}
