export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type?: string;
  created_at?: string;
  modified_at?: string;
}

export interface SelectDropdown {
  key: string;
  value: string;
}

export interface CosmicFile {
  url: string;
  imgix_url: string;
}

export interface StorageSettings extends CosmicObject {
  metadata: {
    files_r_us: string;
    max_storage_bytes: number;
    used_storage_bytes: number;
    max_upload_size_bytes: number;
    cloud_enabled: boolean;
    cloud_max_storage_bytes: number;
    background_primary_color: string;
    accent_color: string;
    default_sort_order: SelectDropdown;
    default_playback_mode: SelectDropdown;
  };
}

export type FileTypeValue = 'Image' | 'Audio' | 'Video' | 'GIF' | 'M3U8 Playlist' | 'Other';
export type PlaybackModeValue = 'Once' | 'Repeat' | 'Loop';
export type SortOrderValue = 'A-Z' | 'Z-A' | 'Newest' | 'Oldest' | 'Size';

export interface FileObject extends CosmicObject {
  metadata: {
    file?: CosmicFile;
    original_name: string;
    epoch_name: string;
    file_type: SelectDropdown;
    file_size_bytes: number;
    upload_progress?: number;
    uploaded_at: number;
    thumbnail_image?: CosmicFile;
    is_cloud_enabled?: boolean;
    playback_mode?: SelectDropdown;
    notes?: string;
  };
}

export interface UploadResponse {
  media: {
    name: string;
    url: string;
    imgix_url: string;
  };
}

export interface FilesApiResponse {
  files: FileObject[];
  total: number;
}

export interface SettingsApiResponse {
  settings: StorageSettings;
}