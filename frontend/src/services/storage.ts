import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 存储文件类型定义
export interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  path: string;
  url: string;
  isPublic: boolean;
  ownerId: string;
  ownerType: 'user' | 'identity' | 'system';
  tags: string[];
  encryptionType: 'none' | 'aes256' | 'custom';
  createdAt: string;
  updatedAt: string;
}

// 存储文件夹类型定义
export interface StorageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  ownerId: string;
  ownerType: 'user' | 'identity' | 'system';
  fileCount: number;
  subfolderCount: number;
  createdAt: string;
  updatedAt: string;
}

// 获取文件列表
export async function fetchFiles(
  params: {
    page?: number;
    pageSize?: number;
    folderId?: string;
    search?: string;
    mimeType?: string;
    sortBy?: 'name' | 'size' | 'createdAt' | 'updatedAt';
    sortDirection?: 'asc' | 'desc';
  } = {}
): Promise<AxiosResponse<{ total: number; items: StorageFile[] }>> {
  return http.get('/api/storage/files', { params });
}

// 获取单个文件详情
export async function fetchFileById(id: string): Promise<AxiosResponse<StorageFile>> {
  return http.get(`/api/storage/files/${id}`);
}

// 上传文件
export async function uploadFile(
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
): Promise<AxiosResponse<StorageFile>> {
  return http.post('/api/storage/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
}

// 更新文件信息
export async function updateFile(
  id: string,
  data: Partial<Pick<StorageFile, 'name' | 'tags' | 'isPublic'>>
): Promise<AxiosResponse<StorageFile>> {
  return http.put(`/api/storage/files/${id}`, data);
}

// 删除文件
export async function deleteFile(id: string): Promise<AxiosResponse<void>> {
  return http.delete(`/api/storage/files/${id}`);
}

// 获取文件夹列表
export async function fetchFolders(
  params: {
    parentId?: string | null;
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'updatedAt';
    sortDirection?: 'asc' | 'desc';
  } = {}
): Promise<AxiosResponse<StorageFolder[]>> {
  return http.get('/api/storage/folders', { params });
}

// 获取文件夹详情
export async function fetchFolderById(id: string): Promise<AxiosResponse<StorageFolder>> {
  return http.get(`/api/storage/folders/${id}`);
}

// 创建文件夹
export async function createFolder(data: {
  name: string;
  parentId?: string | null;
}): Promise<AxiosResponse<StorageFolder>> {
  return http.post('/api/storage/folders', data);
}

// 更新文件夹
export async function updateFolder(
  id: string,
  data: { name: string }
): Promise<AxiosResponse<StorageFolder>> {
  return http.put(`/api/storage/folders/${id}`, data);
}

// 删除文件夹
export async function deleteFolder(
  id: string,
  recursive: boolean = false
): Promise<AxiosResponse<void>> {
  return http.delete(`/api/storage/folders/${id}`, { params: { recursive } });
}

// 移动文件到文件夹
export async function moveFile(
  fileId: string,
  targetFolderId: string | null
): Promise<AxiosResponse<StorageFile>> {
  return http.post(`/api/storage/files/${fileId}/move`, { targetFolderId });
}

// 移动文件夹
export async function moveFolder(
  folderId: string,
  targetFolderId: string | null
): Promise<AxiosResponse<StorageFolder>> {
  return http.post(`/api/storage/folders/${folderId}/move`, { targetFolderId });
}

// 获取存储空间使用统计
export async function getStorageStats(): Promise<
  AxiosResponse<{
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    usedSpace: number;
    availableSpace: number;
  }>
> {
  return http.get('/api/storage/stats');
}

// 分享文件
export async function shareFile(
  fileId: string,
  data: {
    expiresAt?: string;
    password?: string;
    maxDownloads?: number;
  }
): Promise<
  AxiosResponse<{
    id: string;
    url: string;
    expiresAt: string | null;
    hasPassword: boolean;
    maxDownloads: number | null;
    downloadCount: number;
    createdAt: string;
  }>
> {
  return http.post(`/api/storage/files/${fileId}/share`, data);
}

// 获取文件分享列表
export async function getFileShares(fileId?: string): Promise<
  AxiosResponse<
    Array<{
      id: string;
      fileId: string;
      fileName: string;
      url: string;
      expiresAt: string | null;
      hasPassword: boolean;
      maxDownloads: number | null;
      downloadCount: number;
      createdAt: string;
    }>
  >
> {
  return http.get('/api/storage/shares', { params: { fileId } });
}

// 删除文件分享
export async function deleteFileShare(shareId: string): Promise<AxiosResponse<void>> {
  return http.delete(`/api/storage/shares/${shareId}`);
}
