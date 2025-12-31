import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

class R2Service {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!;
    this.publicUrl = process.env.R2_PUBLIC_URL!;

    console.log('R2 Configuration:', {
      bucketName: this.bucketName,
      publicUrl: this.publicUrl,
      endpoint: process.env.R2_ENDPOINT,
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY
    });

    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: Buffer, originalName: string, mimeType: string): Promise<{ url: string; key: string }> {
    try {
      const fileExtension = mime.extension(mimeType) || 'bin';
      const key = `media/${uuidv4()}.${fileExtension}`;

      console.log('Uploading file:', {
        originalName,
        mimeType,
        key,
        bucketName: this.bucketName,
        publicUrl: this.publicUrl
      });

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
      });

      await this.client.send(command);
      console.log('File uploaded successfully to R2');

      const url = `${this.publicUrl}/${key}`;
      console.log('Generated URL:', url);
      return { url, key };
    } catch (error) {
      console.error('Error uploading to R2:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting from R2:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  extractKeyFromUrl(url: string): string {
    // Extract the key from the full URL
    // URL format: https://domain.com/media/uuid.ext
    const urlParts = url.split('/');
    return urlParts.slice(-2).join('/'); // Get 'media/uuid.ext'
  }

  getMediaType(mimeType: string): 'photo' | 'video' | 'reel' {
    if (mimeType.startsWith('image/')) {
      return 'photo';
    } else if (mimeType.startsWith('video/')) {
      // For now, treat all videos as 'video'
      // You could add logic to detect reels based on duration, aspect ratio, etc.
      return 'video';
    } else {
      throw new Error('Unsupported file type');
    }
  }

  validateFile(file: { size: number; mimetype: string }): { valid: boolean; error?: string } {
    const maxSize = 100 * 1024 * 1024; // 100MB for videos
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/svg+xml',
      // Videos
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/mkv',
      'video/3gp',
      'video/m4v'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Maximum size is 100MB.' };
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Unsupported file type. Please upload images or videos.' };
    }

    return { valid: true };
  }
}

export default R2Service;
