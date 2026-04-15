type PortraitCardProps = {
  leaderName: string
  monogram: string
}

export function PortraitCard({ leaderName, monogram }: PortraitCardProps) {
  return (
    <div className="portrait-card" aria-label={`${leaderName} 占位肖像`}>
      <div className="portrait-frame">
        <span className="portrait-monogram">{monogram}</span>
        <span className="portrait-caption">档案图像待补</span>
      </div>
    </div>
  )
}
