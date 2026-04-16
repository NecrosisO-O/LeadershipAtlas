import itemDimensionMapRaw from './generated/item-dimension-map.json'
import profilesRaw from './generated/profiles.json'
import questionsRaw from './generated/questions.json'
import signatureDimensionsRaw from './generated/signature-dimensions.json'
import type { ItemDimensionMeta, ProfileRecord, QuestionRecord } from './schema'

export const questions = questionsRaw as QuestionRecord[]
export const profiles = profilesRaw as ProfileRecord[]
export const itemDimensionMap = itemDimensionMapRaw as Record<string, ItemDimensionMeta>
export const signatureDimensions = signatureDimensionsRaw as Record<string, string[]>

export const totalQuestions = questions.length
export const styleQuestionCount = questions.filter((question) => question.layer === 'style').length
export const ideologyQuestionCount = questions.filter((question) => question.layer === 'ideology').length
export const transitionIndex = questions.findIndex((question) => question.layer === 'ideology')

export const siteCopy = {
  heroTitle: 'Leadership Atlas',
  heroSubtitle: '关于领导风格与治理理念相似性的一次趣味观察。',
  heroDescription:
    '这是一次以人物档案式问题展开的测评，用来观察你在风格与理念上更接近哪些历史领导人。',
  estimatedDuration: '82 题，预计 12-18 分钟',
  introTitle: '请按第一直觉作答',
  introDescription:
    '这份测评更关注你的整体倾向，而不是某一道题的标准答案。作答时请尽量按照第一反应选择，不必反复推敲，也不需要设法靠近某一种“正确结果”。',
  introMeta: '结果会从综合、风格与理念三个层面呈现。',
  disclaimer: '本结果用于趣味匹配与风格参考，不代表政治立场判定或历史结论。',
  heroHint: '点击封面继续',
  transitions: {
    style: {
      eyebrow: '第一部分',
      title: '领导风格',
      description: '这一部分更关注你如何领导、如何表达、如何做决定，以及你在组织与动员他人时的惯常方式。',
      cta: '进入第一部分',
    },
    ideology: {
      eyebrow: '第二部分',
      title: '执政理念',
      description: '这一部分更关注你对国家角色、合法性来源、改革方向，以及国际秩序的整体看法。',
      cta: '进入第二部分',
    },
  },
}
