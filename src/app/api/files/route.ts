import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Upload } from '@/models/Upload';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const uploads = await Upload.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ uploads });
  } catch (error: any) {
    console.error('Fetch files error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
