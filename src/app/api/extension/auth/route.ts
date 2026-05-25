import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ extensionToken: token });

    if (!user) {
      return NextResponse.json({ error: 'Invalid extension token' }, { status: 401 });
    }

    return NextResponse.json({ success: true, userId: user._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
