// @/app/api/cloudinary/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function DELETE(request: NextRequest) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const isPDF = public_id.toLowerCase().includes('.pdf') || 
                  public_id.toLowerCase().includes('consent_');
    
    const resourceType = isPDF ? 'raw' : 'image';
    
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resourceType,
    });

    return NextResponse.json({ result: result.result });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}