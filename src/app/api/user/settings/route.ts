import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('username privacySettings email').lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Auto-generate username for existing users if missing
    if (!user.username) {
      const baseUsername = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const randomSuffix = Math.floor(Math.random() * 10000);
      const generatedUsername = `${baseUsername}${randomSuffix}`;
      
      await User.findByIdAndUpdate(session.user.id, { username: generatedUsername });
      user.username = generatedUsername;
    }

    return NextResponse.json({
      username: user.username,
      privacySettings: user.privacySettings || {
        isProfilePublic: false,
        showStats: true,
        showSolutions: true,
        showNotes: true,
      }
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { username, privacySettings } = body;

    await dbConnect();

    // If changing username, check uniqueness
    if (username) {
      const formattedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
      const existing = await User.findOne({ username: formattedUsername, _id: { $ne: session.user.id } });
      if (existing) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
      
      await User.findByIdAndUpdate(session.user.id, { 
        username: formattedUsername,
        ...(privacySettings ? { privacySettings } : {})
      });
      
      return NextResponse.json({ success: true, username: formattedUsername, privacySettings });
    } else if (privacySettings) {
      await User.findByIdAndUpdate(session.user.id, { privacySettings });
      return NextResponse.json({ success: true, privacySettings });
    }

    return NextResponse.json({ error: 'No data provided' }, { status: 400 });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
