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
  heroSubtitle: '一份关注风格与理念相似性的领导人匹配测评',
  heroDescription:
    '这不是知识竞赛，也不是立场投票。它更像一份人物档案式问卷：通过你的作答方式，去观察你在领导风格与治理理念上最接近哪些历史领导人。',
  estimatedDuration: '82 题，预计 12-18 分钟',
  introTitle: '作答说明',
  introDescription:
    '请按第一直觉作答，不必追求题题都想清楚。系统更关注你整体的倾向轮廓，而不是某一题的标准答案。',
  introBullets: [
    '这不是政治立场投票',
    '这不是历史知识测试',
    '请按第一直觉作答',
    '不要过度推敲单题',
  ],
  disclaimer: '本结果用于趣味匹配与风格参考，不代表政治立场判定或历史结论。',
  heroHint: '点击封面继续',
  transitions: {
    style: {
      eyebrow: '第一部分',
      title: '领导风格',
      description: '这一部分更关注你如何领导、如何表达、如何调动他人，以及你在组织与决策中的惯常方式。',
      cta: '进入第一部分',
    },
    ideology: {
      eyebrow: '第二部分',
      title: '执政理念',
      description: '这一部分更关注你对国家角色、合法性来源、改革方向，以及国际秩序的整体看法。',
      cta: '进入第二部分',
    },
  },
  placeholderReason:
    '第一版结果页先展示占位说明。后续版本会补充更具体的匹配理由、命中维度与差异解释。',
}
