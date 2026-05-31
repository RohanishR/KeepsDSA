import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/dbConnect';
import { Upload } from '@/models/Upload';

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
    const { file, resourceType = 'auto', originalName = 'upload', topics = [] } = body;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Base64 overhead is ~33%, so a 5MB file is roughly 6.6MB in length.
    // We set a hard limit of 8,000,000 characters to prevent overloading the server.
    if (file.length > 8000000) {
      return NextResponse.json({ error: 'File size exceeds the 5MB limit' }, { status: 413 });
    }

    await dbConnect();

    const isPdf = file.startsWith('data:application/pdf');
    const uploadOptions: any = {
      folder: `keepsdsa/users/${session.user.id}`,
      resource_type: resourceType, // 'image', 'video', 'raw', or 'auto'
    };

    if (isPdf) {
      // Cloudinary needs the extension in the public_id for 'raw' files so browsers download it properly
      uploadOptions.public_id = `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}.pdf`;
    }

    const uploadResponse = await cloudinary.uploader.upload(file, uploadOptions);

    const newUpload = await Upload.create({
      userId: session.user.id,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      originalName: originalName,
      resourceType: uploadResponse.resource_type,
      format: uploadResponse.format || '',
      size: uploadResponse.bytes,
      topics: topics,
    });

    return NextResponse.json({ 
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      originalName: originalName,
      resourceType: uploadResponse.resource_type,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
      _id: newUpload._id,
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

    await dbConnect();
    await Upload.deleteOne({ publicId, userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
