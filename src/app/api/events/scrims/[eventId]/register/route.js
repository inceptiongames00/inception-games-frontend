import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { eventId } = params;
    const body = await request.json();

    // Validate required fields for scrims registration
    const requiredFields = ['user_id', 'slot_date', 'slot_time', 'full_name', 'email', 'phone', 'in_game_name', 'in_game_id'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Call actual backend API with event ID
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';
    
    // Get authorization header from the client request
    const authHeader = request.headers.get('authorization');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward the authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${backendUrl}/events/scrims/${eventId}/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Registration failed' 
      }, { status: response.status });
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You will receive a confirmation email shortly.',
      data: result.data || result
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
