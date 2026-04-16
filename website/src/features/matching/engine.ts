import { itemDimensionMap, profiles, signatureDimensions } from '../../data/content'
import type { AnswerMap, AnswerValue, DimensionInsight, LeaderMatch, ProfileRecord, RankedLeader } from '../../data/schema'

const BLOCK_DIMENSIONS = new Set(['G_BLOCK_VALUES', 'G_BLOCK_LEGIT'])

const coreCounts = profiles.reduce<Record<string, number>>((accumulator, profile) => {
  profile.coreDimensions.forEach((dimensionId) => {
    accumulator[dimensionId] = (accumulator[dimensionId] ?? 0) + 1
  })
  return accumulator
}, {})

function isPointAllocation(value: AnswerValue): value is Record<string, number> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function itemSimilarity(userValue: AnswerValue, leaderValue: AnswerValue): number {
  if (isPointAllocation(userValue) || isPointAllocation(leaderValue)) {
    if (isPointAllocation(userValue) && isPointAllocation(leaderValue)) {
      const keys = Array.from(new Set([...Object.keys(userValue), ...Object.keys(leaderValue)])).sort()
      const diff = keys.reduce((sum, key) => sum + Math.abs((userValue[key] ?? 0) - (leaderValue[key] ?? 0)), 0)
      return Math.max(0, 1 - diff / 20)
    }
    return 0
  }

  if (typeof userValue === 'string' || typeof leaderValue === 'string') {
    return userValue === leaderValue ? 1 : 0
  }

  return Math.max(0, 1 - Math.abs(Number(userValue) - Number(leaderValue)) / 6)
}

function blockMultiplier(dimensionId: string): number {
  return BLOCK_DIMENSIONS.has(dimensionId) ? 0.6 : 1
}

function dimWeight(dimensionId: string): number {
  const count = coreCounts[dimensionId] ?? 1
  if (count <= 2) return 1.15
  if (count <= 4) return 1.08
  return 1
}

function layerScore(
  userAnswers: AnswerMap,
  profile: ProfileRecord,
  layer: 'style' | 'ideology',
): { score: number; dimensions: DimensionInsight[] } {
  const byDimension = new Map<string, { tier: 'core' | 'reference'; values: number[]; dimensionName: string }>()
  const sigDimensions = new Set(signatureDimensions[profile.leaderId] ?? [])

  Object.entries(profile.answers).forEach(([itemId, meta]) => {
    const mapped = itemDimensionMap[itemId]
    if (!mapped || mapped.layer !== layer) return
    const userValue = userAnswers[itemId]
    if (userValue === undefined) return

    const similarity = itemSimilarity(userValue, meta.value)
    const dimensionId = mapped.dimension_id
    const existing = byDimension.get(dimensionId) ?? {
      tier: meta.tier,
      values: [],
      dimensionName: mapped.dimension_name.replace('**', ''),
    }
    existing.values.push(similarity)
    byDimension.set(dimensionId, existing)
  })

  const dimensionInsights: DimensionInsight[] = []
  const core: Array<{ avg: number; weight: number; signature: boolean }> = []
  const ref: Array<{ avg: number; weight: number }> = []

  byDimension.forEach((info, dimensionId) => {
    const avg = (info.values.reduce((sum, value) => sum + value, 0) / info.values.length) * blockMultiplier(dimensionId)
    dimensionInsights.push({
      dimensionId,
      dimensionName: info.dimensionName,
      layer,
      tier: info.tier,
      score: avg,
      signature: sigDimensions.has(dimensionId),
    })
    if (info.tier === 'core') {
      const signature = sigDimensions.has(dimensionId)
      core.push({ avg, weight: dimWeight(dimensionId) * (signature ? 1.5 : 1), signature })
      return
    }
    ref.push({ avg, weight: dimWeight(dimensionId) })
  })

  const coreAvg = core.length
    ? core.reduce((sum, item) => sum + item.avg * item.weight, 0) / core.reduce((sum, item) => sum + item.weight, 0)
    : 0
  const refAvg = ref.length
    ? ref.reduce((sum, item) => sum + item.avg * item.weight, 0) / ref.reduce((sum, item) => sum + item.weight, 0)
    : 0

  const base = 0.8 * coreAvg + 0.2 * refAvg
  const severe = core.filter((item) => item.avg < 0.35).length
  const moderate = core.filter((item) => item.avg >= 0.35 && item.avg < 0.55).length
  const denominator = core.length || 1
  const penalty = 0.2 * (severe / denominator) + 0.08 * (moderate / denominator)
  const sigTotal = core.filter((item) => item.signature).length
  const sigHits = core.filter((item) => item.signature && item.avg >= 0.55).length
  const sigPenalty = sigTotal ? 0.08 * ((sigTotal - sigHits) / sigTotal) : 0

  return {
    score: Math.max(0, base - penalty - sigPenalty),
    dimensions: dimensionInsights.sort((left, right) => right.score - left.score),
  }
}

export function rankAnswers(userAnswers: AnswerMap): LeaderMatch[] {
  return profiles
    .map((profile) => {
      const style = layerScore(userAnswers, profile, 'style')
      const ideology = layerScore(userAnswers, profile, 'ideology')
      return {
        leaderId: profile.leaderId,
        leaderName: profile.leaderName,
        monogram: profile.monogram,
        style: style.score,
        ideology: ideology.score,
        overall: 0.5 * style.score + 0.5 * ideology.score,
        dimensions: [...style.dimensions, ...ideology.dimensions],
      }
    })
    .sort((left, right) => right.overall - left.overall || right.style - left.style || right.ideology - left.ideology)
}

export function rankByLayer(userAnswers: AnswerMap, layer: 'style' | 'ideology'): RankedLeader[] {
  return rankAnswers(userAnswers).sort((left, right) => right[layer] - left[layer] || right.overall - left.overall)
}

export function getProfileRecord(leaderId: string): ProfileRecord | undefined {
  return profiles.find((profile) => profile.leaderId === leaderId)
}

export function summarizeLeaderMatch(match: LeaderMatch) {
  const strongest = match.dimensions.filter((dimension) => dimension.tier === 'core').slice(0, 3)
  const weakest = [...match.dimensions].sort((left, right) => left.score - right.score).filter((dimension) => dimension.tier === 'core').slice(0, 2)

  return { strongest, weakest }
}
