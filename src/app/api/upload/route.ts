import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { file, resourceType = 'auto' } = body; // Base64 string and resource type

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: `keepsdsa/users/${session.user.id}`,
      resource_type: resourceType, // 'image', 'video', 'raw', or 'auto'
    });

    return NextResponse.json({ 
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      originalName: uploadResponse.original_filename,
      resourceType: uploadResponse.resource_type,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // Attempt to determine resource type. Cloudinary requires `resource_type: 'raw'` when destroying PDFs.
    // If not sure, we can try 'image' first, then 'raw' if it fails, but typically we know from the format.
    // Let's just try to destroy with default ('image') and if 'not found', try 'raw'.
    
    let destroyResponse = await cloudinary.uploader.destroy(publicId);

    if (destroyResponse.result === 'not found') {
      destroyResponse = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    if (destroyResponse.result !== 'ok' && destroyResponse.result !== 'not found') {
      throw new Error(`Cloudinary deletion failed: ${destroyResponse.result}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
