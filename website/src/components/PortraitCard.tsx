type PortraitCardProps = {
  leaderName: string
  portraitUrl: string
  portraitObjectPosition: string
  portraitScale: number
  portraitAttribution: string
  portraitLicense: string
  portraitSource: string
}

export function PortraitCard({
  leaderName,
  portraitUrl,
  portraitObjectPosition,
  portraitScale,
  portraitAttribution,
  portraitLicense,
  portraitSource,
}: PortraitCardProps) {
  return (
    <figure className="portrait-card">
      <div className="portrait-frame">
        <img
          className="portrait-image"
          src={portraitUrl}
          alt={leaderName}
          loading="lazy"
          style={{ objectPosition: portraitObjectPosition, transform: `scale(${portraitScale})` }}
        />
      </div>
      <figcaption className="portrait-caption">
        <span>{portraitAttribution}</span>
        <a href={portraitSource} target="_blank" rel="noreferrer">
          {portraitLicense}
        </a>
      </figcaption>
    </figure>
  )
}
