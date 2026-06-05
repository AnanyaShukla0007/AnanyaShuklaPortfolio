import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Ananya Shukla | .NET Full Stack & AI/ML Engineer'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f8d5b0 0%, #f5954a 50%, #e85500 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div style={{ fontSize: 18, color: '#1a0800', opacity: 0.7, marginBottom: 16, letterSpacing: 4, textTransform: 'uppercase' }}>
          Portfolio
        </div>
        <div style={{ fontSize: 80, fontWeight: 900, color: '#1a0800', lineHeight: 1, marginBottom: 24 }}>
          Ananya<br />Shukla
        </div>
        <div style={{ fontSize: 24, color: '#1a0800', opacity: 0.8 }}>
          .NET Full Stack · AI/ML Engineer · Data Analyst
        </div>
      </div>
    ),
    { ...size }
  )
}
