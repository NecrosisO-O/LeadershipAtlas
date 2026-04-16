export type Layer = 'style' | 'ideology'

export type QuestionType =
  | 'likert-single'
  | 'likert-bipolar'
  | 'scenario-single'
  | 'forced-choice'
  | 'point-allocation'

export type ChoiceOption = {
  id: string
  label: string
  text: string
}

export type QuestionRecord = {
  id: string
  displayNo: number
  legacyId: string
  layer: Layer
  section: string
  dimensionId: string
  dimensionName: string
  type: QuestionType
  prompt: string
  leftLabel: string | null
  rightLabel: string | null
  options: ChoiceOption[]
  totalPoints: number | null
  scaleMin: number | null
  scaleMax: number | null
}

export type AnswerValue = number | string | Record<string, number>

export type AnswerMap = Record<string, AnswerValue>

export type ProfileAnswer = {
  tier: 'core' | 'reference'
  value: AnswerValue
}

export type ProfileRecord = {
  leaderId: string
  leaderName: string
  monogram: string
  coreDimensions: string[]
  answers: Record<string, ProfileAnswer>
}

export type ItemDimensionMeta = {
  dimension_id: string
  dimension_name: string
  layer: Layer
  legacy_id: string
  display_no: number
}

export type RankedLeader = {
  leaderId: string
  leaderName: string
  monogram: string
  overall: number
  style: number
  ideology: number
}

export type DimensionInsight = {
  dimensionId: string
  dimensionName: string
  layer: Layer
  tier: 'core' | 'reference'
  score: number
  signature: boolean
}

export type LeaderMatch = RankedLeader & {
  dimensions: DimensionInsight[]
}

export type AppStage = 'welcome' | 'intro' | 'question' | 'transition' | 'results'

export type ProgressSnapshot = {
  answeredCount: number
  totalCount: number
  currentNo: number
}
