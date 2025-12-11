// @/utils/uploadGuardianDocs.ts
import { v4 as uuidv4 } from 'uuid';

interface UploadResponse {
  secure_url: string;
  public_id: string;
  error?: string;
}

export async function uploadGuardianDocument(
  file: File,
  guardianId: string,
  fileType: 'consent' | 'nationalID'
): Promise<UploadResponse> {
  if (!file) {
    return { secure_url: '', public_id: '', error: 'No file provided' };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    return { 
      secure_url: '', 
      public_id: '', 
      error: 'Only JPEG, PNG, and PDF files are allowed' 
    };
  }

  if (file.size > 5 * 1024 * 1024) {// (5MB max)
    return { 
      secure_url: '', 
      public_id: '', 
      error: 'File size must be less than 5MB' 
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  
  const folder = `guardian-documents/${guardianId}`;
  formData.append('folder', folder);
  
  const uniqueId = uuidv4().substring(0, 8);
  const timestamp = Date.now();
  formData.append('public_id', `${fileType}_${timestamp}_${uniqueId}`);

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgzfnizjq';
    
    const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        secure_url: '', 
        public_id: '', 
        error: errorData.error?.message || 'Upload failed' 
      };
    }

    const data = await response.json();
    
    console.log('✅ Cloudinary upload successful:', {
      secure_url: data.secure_url,
      public_id: data.public_id,
      resource_type: data.resource_type,
    });
    
    return {
      secure_url: data.secure_url,
      public_id: data.public_id
    };
  } catch (error) {
    console.error('Guardian document upload error:', error);
    return { 
      secure_url: '', 
      public_id: '', 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
}

export async function uploadSignature(
  base64Data: string,
  guardianId: string
): Promise<UploadResponse> {
  if (!base64Data) {
    return { secure_url: '', public_id: '', error: 'No signature data provided' };
  }

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('upload_preset', 'ml_default');
  
  const folder = `guardian-documents/${guardianId}`;
  formData.append('folder', folder);
  
  const uniqueId = uuidv4().substring(0, 8);
  const timestamp = Date.now();
  formData.append('public_id', `signature_${timestamp}_${uniqueId}`);

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgzfnizjq';
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        secure_url: '', 
        public_id: '', 
        error: errorData.error?.message || 'Signature upload failed' 
      };
    }

    const data = await response.json();
    
    console.log('✅ Signature upload successful:', {
      secure_url: data.secure_url,
      public_id: data.public_id,
    });
    
    return {
      secure_url: data.secure_url,
      public_id: data.public_id
    };
  } catch (error) {
    console.error('Signature upload error:', error);
    return { 
      secure_url: '', 
      public_id: '', 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
}

export async function deleteGuardianDocument(publicId: string): Promise<{ result: string, error?: string }> {
  if (!publicId) {
    return { result: 'not_found', error: 'No public ID provided' };
  }

  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        result: 'error', 
        error: errorData.error || 'Deletion failed' 
      };
    }

    const data = await response.json();
    return { result: data.result };
  } catch (error) {
    console.error('Document deletion error:', error);
    return { 
      result: 'error', 
      error: error instanceof Error ? error.message : 'Unknown deletion error' 
    };
  }
}