import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get('name') || 'Player';
    const playerTag = searchParams.get('tag') || 'sns';
    const primaryGame = searchParams.get('game') || 'Gaming';
    const rank = searchParams.get('rank') || 'Enthusiast';
    const avatarUrl = searchParams.get('avatar');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#060608',
            backgroundImage: 'linear-gradient(135deg, #0f0a2e 0%, #1a0a2e 50%, #16051a 100%)',
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient background effects */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              zIndex: 10,
              maxWidth: '90%',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                display: 'flex',
                width: '200px',
                height: '200px',
                borderRadius: '24px',
                background: avatarUrl
                  ? `url(${avatarUrl})`
                  : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '3px solid rgba(168,85,247,0.5)',
                boxShadow: '0 20px 40px rgba(168,85,247,0.2)',
                flexShrink: 0,
              }}
            />

            {/* Player Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {playerName}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#a78bfa',
                  margin: 0,
                }}
              >
                @{playerTag}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '16px',
                    color: '#d1d5db',
                    background: 'rgba(168,85,247,0.1)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(168,85,247,0.3)',
                  }}
                >
                  🎮 {primaryGame}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '16px',
                    color: '#d1d5db',
                    background: 'rgba(236,72,153,0.1)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(236,72,153,0.3)',
                  }}
                >
                  ⭐ {rank}
                </div>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: '500',
            }}
          >
            Inception Games
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
