import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[Event Registration API] Registration data received:', body);

    // Validate required fields
    const requiredFields = ['user_id', 'slot_date', 'slot_time', 'team_name', 'full_name', 'email', 'phone', 'in_game_name', 'in_game_id'];
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

    // TODO: Replace this mock implementation with actual API call to your backend
    // 
    // INTEGRATION INSTRUCTIONS:
    // 1. Replace the mock response below with a call to your actual backend API
    // 2. Update the URL to match your backend endpoint
    // 3. Add any required authentication headers
    // 4. Handle specific error responses from your backend
    //
    // Example integration:
    // const response = await fetch('https://inception-games.an.r.appspot.com/api/v1/events/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`, // if auth required
    //   },
    //   body: JSON.stringify(registrationData)
    // });
    // 
    // if (!response.ok) {
    //   const error = await response.json();
    //   return NextResponse.json({ 
    //     success: false, 
    //     message: error.message || 'Registration failed' 
    //   }, { status: response.status });
    // }
    // 
    // const result = await response.json();
    // return NextResponse.json({
    //   success: true,
    //   message: 'Registration successful!',
    //   data: result
    // });

    // MOCK RESPONSE (remove this section when integrating with real backend)
    const registrationData = {
      user_id: body.user_id,
      slot_date: body.slot_date,
      slot_time: body.slot_time,
      team_name: body.team_name,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      in_game_name: body.in_game_name,
      in_game_id: body.in_game_id,
      players: body.players || [],
      registration_id: `REG_${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Simulate processing delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('[Event Registration API] Registration successful:', registrationData);

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You will receive a confirmation email shortly.',
      data: registrationData
    });

  } catch (error) {
    console.error('[Event Registration API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}