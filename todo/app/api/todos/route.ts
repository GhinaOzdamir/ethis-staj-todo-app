import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { success: false, message: 'API_URL not configured in .env.local' },
        { status: 500 }
      );
    }

    // ✅ Get filters from query string
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    // ✅ Forward these filters to Laravel
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (priority) query.append('priority', priority);
    if (search) query.append('search', search);
    if (sort) query.append('sort', sort);

    const fullUrl = `${API_URL}/api/todos${query.toString() ? `?${query}` : ''}`;
    console.log('🔍 Fetching Laravel todos:', fullUrl);

    // ✅ USE fullUrl instead of hardcoded URL
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📡 Response status:', response.status);

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text();
      console.error('❌ Laravel returned HTML instead of JSON:', htmlText.substring(0, 200));
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Laravel API returned HTML error page. Check Laravel logs.',
          hint: 'Laravel might have an error. Check terminal running php artisan serve'
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Laravel error:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Laravel API error (${response.status})`,
          details: errorText.substring(0, 200)
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Data received successfully:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error in Next.js API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📤 Sending POST to Laravel:', body);
    
    const response = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text();
      console.error('❌ Laravel returned HTML:', htmlText.substring(0, 200));
      
      return NextResponse.json(
        { success: false, message: 'Laravel API error - returned HTML' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error creating todo:', errorText);
      
      return NextResponse.json(
        { success: false, message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Todo created:', data);
    
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating todo:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create todo' },
      { status: 500 }
    );
  }
}




