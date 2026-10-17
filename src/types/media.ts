/** An image referenced by content: a static file under /public or a Cloudinary upload. */
export interface ImageAsset {
  url: string;
  /** Cloudinary public_id. Absent for static images shipped in /public. */
  publicId?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface MediaAssetRecord {
  id: string;
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  alt: string;
  originalFilename?: string;
  createdAt: string;
  /** How many records reference this asset (admin listings only). */
  usageCount?: number;
}
