import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export async function getStorageSettings() {
  try {
    const response = await cosmic.objects.findOne({
      type: 'storage-settings',
      slug: 'files-r-us',
    }).props(['id', 'title', 'slug', 'metadata']).depth(1)
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch storage settings');
  }
}

export async function getFiles() {
  try {
    const response = await cosmic.objects
      .find({ type: 'files' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch files');
  }
}

export async function deleteFileObject(id: string) {
  try {
    await cosmic.objects.deleteOne(id);
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw new Error('Failed to delete file');
  }
}

export async function createFileObject(data: {
  title: string;
  slug: string;
  metadata: Record<string, unknown>;
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'files',
      title: data.title,
      slug: data.slug,
      metadata: data.metadata,
    });
    return response.object;
  } catch (error) {
    console.error('Failed to create file object:', error);
    throw new Error('Failed to create file object');
  }
}

export async function updateStorageUsed(usedBytes: number) {
  try {
    const settings = await getStorageSettings();
    if (!settings) return;
    await cosmic.objects.updateOne(settings.id, {
      metadata: {
        used_storage_bytes: usedBytes,
      },
    });
  } catch (error) {
    console.error('Failed to update storage:', error);
  }
}

export async function uploadMedia(file: Buffer, fileName: string) {
  try {
    const response = await cosmic.media.insertOne({
      media: {
        originalname: fileName,
        buffer: file,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to upload media:', error);
    throw new Error('Failed to upload media');
  }
}