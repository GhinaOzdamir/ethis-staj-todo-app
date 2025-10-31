import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET single todo
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('🔍 GET single todo, ID:', id);
    
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Invalid todo ID' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Laravel error:', errorText);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch todo' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Todo fetched:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error fetching todo:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PATCH update todo
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    console.log('📝 PATCH todo, ID:', id, 'Body:', body);
    
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Invalid todo ID' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Laravel error:', errorText);
      return NextResponse.json(
        { success: false, message: 'Failed to update todo' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Todo updated:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error updating todo:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE todo
export async function DELETE(
  request: NextRequest,
  { params }: any  // Use any temporarily
) {
  try {
    // Try to get id from params
    const id = params?.id || (await params)?.id;
    
    console.log('🗑️ DELETE todo, ID:', id);
    console.log('📦 Full params:', params);
    
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Invalid todo ID' },
        { status: 400 }
      );
    }
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Laravel error:', errorText);
      return NextResponse.json(
        { success: false, message: 'Failed to delete todo' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Todo deleted:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error deleting todo:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}