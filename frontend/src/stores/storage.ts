import { defineStore } from 'pinia';
import axios from 'axios';

// 存储类型枚举
export enum StorageType {
  IPFS = 'ipfs',
  CERAMIC = 'ceramic',
}

// 存储数据接口
export interface StorageData {
  cid: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  storageType: StorageType;
  createdAt: string;
  metadata?: Record<string, any>;
  previewUrl?: string;
}

// 索引记录接口
export interface StorageIndex {
  id: string;
  cid: string;
  name: string;
  size: number;
  storageType: StorageType;
  createdAt: string;
  ownerId: string;
  ownerName?: string;
  accessCount: number;
  lastAccessedAt?: string;
  tags?: string[];
}

// 上传参数接口
export interface UploadParams {
  file?: File;
  jsonData?: string;
  name: string;
  storageType: StorageType;
  metadata?: Record<string, any>;
  isPublic?: boolean;
}

// 上传响应接口
export interface UploadResponse {
  success: boolean;
  cid?: string;
  message?: string;
  error?: string;
}

// Store状态接口
interface StorageState {
  currentData: StorageData | null;
  indexes: StorageIndex[];
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    currentPage: number;
    pageSize: number;
  };
}

export const useStorageStore = defineStore('storage', {
  state: (): StorageState => ({
    currentData: null,
    indexes: [],
    uploadProgress: 0,
    uploadStatus: 'idle',
    loading: false,
    error: null,
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
  }),

  getters: {
    getCurrentData: (state) => state.currentData,
    getIndexes: (state) => state.indexes,
    getUploadProgress: (state) => state.uploadProgress,
    getUploadStatus: (state) => state.uploadStatus,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination,
  },

  actions: {
    // 上传数据
    async uploadData(params: UploadParams): Promise<UploadResponse> {
      this.uploadStatus = 'uploading';
      this.uploadProgress = 0;
      this.error = null;

      try {
        const formData = new FormData();

        if (params.file) {
          formData.append('file', params.file);
        } else if (params.jsonData) {
          // 创建JSON Blob并作为文件附加
          const jsonBlob = new Blob([params.jsonData], { type: 'application/json' });
          formData.append('file', jsonBlob, `${params.name || 'data'}.json`);
        }

        formData.append('name', params.name);
        formData.append('storageType', params.storageType);

        if (params.metadata) {
          formData.append('metadata', JSON.stringify(params.metadata));
        }

        if (params.isPublic !== undefined) {
          formData.append('isPublic', params.isPublic.toString());
        }

        const response = await axios.post('/storage/upload', formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            }
          },
        });

        this.uploadStatus = 'success';
        this.uploadProgress = 100;

        return {
          success: true,
          cid: response.data.cid,
          message: response.data.message || '上传成功',
        };
      } catch (error) {
        this.uploadStatus = 'error';
        const errorMessage = error instanceof Error ? error.message : '上传失败';
        this.error = errorMessage;
        console.error('上传数据失败:', error);

        return {
          success: false,
          error: errorMessage,
          message: '上传失败，请稍后重试',
        };
      }
    },

    // 根据CID获取数据
    async fetchDataByCid(cid: string) {
      this.loading = true;
      this.error = null;
      this.currentData = null;

      try {
        const response = await axios.get(`/storage/${cid}`);
        this.currentData = response.data.data;
      } catch (error) {
        console.error('获取数据失败:', error);
        this.error = error instanceof Error ? error.message : '获取数据失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取索引列表
    async fetchIndexes(page = 1, pageSize = 10, filters = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/storage/indexes', {
          params: {
            page,
            pageSize,
            ...filters,
          },
        });

        this.indexes = response.data.data || [];
        this.pagination = {
          total: response.data.total || 0,
          currentPage: page,
          pageSize,
        };
      } catch (error) {
        console.error('获取索引列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取索引列表失败';
      } finally {
        this.loading = false;
      }
    },

    // 重置上传状态
    resetUploadState() {
      this.uploadStatus = 'idle';
      this.uploadProgress = 0;
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },
  },
});
