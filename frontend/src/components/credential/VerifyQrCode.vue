<template>
  <div class="verify-qrcode">
    <div class="card p-6">
      <h3 class="text-xl font-semibold text-textlight mb-4">扫码验证凭证</h3>
      <p class="text-textgray mb-6">扫描下方的二维码，或将设备靠近NFC标签进行验证</p>

      <div class="flex flex-col items-center">
        <!-- 二维码扫描区域 -->
        <div class="qr-scanner-container relative mb-6 w-full max-w-sm">
          <div class="qr-code-frame bg-darkbg/50 p-4 rounded-lg text-center">
            <div v-if="!isScanning" class="flex flex-col items-center py-8">
              <span class="i-carbon-qr-code text-6xl text-textgray mb-4"></span>
              <p class="text-textlight mb-2">点击开始扫描二维码</p>
              <button @click="startScan" class="btn-primary mt-4 px-8 py-2">
                开始扫描
              </button>
            </div>

            <div v-else class="qr-video-container bg-black w-64 h-64 mx-auto relative">
              <video ref="videoElement" class="w-full h-full"></video>
              <div class="scan-overlay absolute inset-0 pointer-events-none">
                <div class="scan-line absolute top-0 left-0 right-0 h-0.5 bg-neon/70 animate-scan-move"></div>
                <div class="scan-corners">
                  <div class="corner-tl absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon"></div>
                  <div class="corner-tr absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon"></div>
                  <div class="corner-bl absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon"></div>
                  <div class="corner-br absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon"></div>
                </div>
              </div>
            </div>

            <!-- 扫描中状态 -->
            <div v-if="isScanning" class="mt-4 flex justify-center">
              <button @click="stopScan" class="btn-secondary py-1 px-4 text-sm">
                <span class="i-carbon-close mr-1"></span>停止扫描
              </button>
            </div>
          </div>
        </div>

        <!-- 扫描说明 -->
        <div class="scanning-instructions text-center px-4 mb-6 max-w-sm">
          <p class="text-sm text-textgray">将凭证二维码对准摄像头，保持稳定直到识别成功</p>
        </div>

        <!-- 分隔线 -->
        <div class="divider flex items-center w-full mb-6">
          <div class="divider-line flex-1 border-b border-gray-700"></div>
          <div class="px-4 text-textgray text-sm">或者</div>
          <div class="divider-line flex-1 border-b border-gray-700"></div>
        </div>

        <!-- NFC识别区域 -->
        <div class="nfc-section w-full max-w-sm mb-6">
          <div class="bg-darkbg/50 rounded-lg p-4 text-center">
            <div class="flex flex-col items-center py-4">
              <span class="i-carbon-wireless text-4xl text-textgray mb-3"></span>
              <p class="text-textlight mb-2">使用NFC读取凭证</p>
              <p class="text-sm text-textgray mb-4">将您的设备靠近NFC凭证标签</p>
              <button @click="startNfcScan" class="btn-secondary py-2 px-6" :disabled="!hasNfcSupport || isNfcScanning">
                <span v-if="isNfcScanning" class="i-carbon-circle-dash animate-spin mr-2"></span>
                {{ isNfcScanning ? '正在扫描...' : '开始NFC扫描' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 最近扫描记录 -->
        <div v-if="recentScans.length > 0" class="recent-scans w-full mt-6">
          <h4 class="text-textlight font-medium mb-3">最近扫描记录</h4>
          <div class="bg-darkbg/50 rounded-lg p-3">
            <div v-for="(scan, index) in recentScans" :key="index"
              class="scan-item border-b border-gray-700 last:border-0 py-2 flex justify-between items-center">
              <div>
                <div class="text-sm text-textlight">{{ scan.type }}</div>
                <div class="text-xs text-textgray">{{ formatDate(scan.time) }}</div>
              </div>
              <span :class="scan.success ? 'text-green-500' : 'text-red-500'" class="text-lg">
                <span :class="scan.success ? 'i-carbon-checkmark' : 'i-carbon-close'"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { logger } from '../../utils/logger';

  // 扫描状态
  const isScanning = ref(false);
  const videoElement = ref<HTMLVideoElement | null>(null);
  const stream = ref<MediaStream | null>(null);

  // NFC状态
  const hasNfcSupport = ref(false);
  const isNfcScanning = ref(false);

  // 扫描记录
  const recentScans = ref([
    { type: '学历证书', time: new Date().toISOString(), success: true },
    { type: '会员卡', time: new Date(Date.now() - 120000).toISOString(), success: false }
  ]);

  // 检查设备支持
  onMounted(() => {
    logger.info('Component:VerifyQrCode', '二维码验证组件已加载');

    // 检查NFC支持
    if ('NDEFReader' in window) {
      hasNfcSupport.value = true;
      logger.info('Component:VerifyQrCode', '设备支持NFC');
    } else {
      logger.info('Component:VerifyQrCode', '设备不支持NFC');
    }
  });

  // 清理资源
  onUnmounted(() => {
    stopScan();
  });

  // 开始扫描
  const startScan = async () => {
    try {
      isScanning.value = true;
      logger.info('Component:VerifyQrCode', '开始扫描二维码');

      // 请求摄像头访问
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoElement.value) {
        videoElement.value.srcObject = stream.value;
        videoElement.value.setAttribute('playsinline', 'true');
        videoElement.value.play();

        // 实际项目中需要添加二维码识别的逻辑
        startQrCodeDetection();
      }
    } catch (error) {
      logger.error('Component:VerifyQrCode', '无法访问摄像头', { error });
      isScanning.value = false;
      alert('无法访问摄像头，请确保已授予摄像头访问权限');
    }
  };

  // 停止扫描
  const stopScan = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop());
      stream.value = null;
    }

    isScanning.value = false;
    logger.info('Component:VerifyQrCode', '停止扫描二维码');
  };

  // 模拟二维码检测
  const startQrCodeDetection = () => {
    // 在实际项目中，这里应该使用如jsQR等库进行二维码检测
    // 这里仅用setTimeout模拟扫描过程
    logger.info('Component:VerifyQrCode', '开始二维码检测');

    // 模拟5秒后检测到二维码
    setTimeout(() => {
      if (isScanning.value) {
        onQrCodeDetected({
          data: 'https://example.com/credential/12345'
        });
      }
    }, 5000);
  };

  // 二维码检测成功
  const onQrCodeDetected = (result: { data: string }) => {
    logger.info('Component:VerifyQrCode', '检测到二维码', { data: result.data });

    // 模拟添加一条扫描记录
    recentScans.value.unshift({
      type: '凭证二维码',
      time: new Date().toISOString(),
      success: true
    });

    // 处理扫描结果
    stopScan();

    // 触发事件，通知父组件处理凭证数据
    emit('code-detected', result.data);
  };

  // 开始NFC扫描
  const startNfcScan = async () => {
    if (!hasNfcSupport.value || isNfcScanning.value) return;

    isNfcScanning.value = true;
    logger.info('Component:VerifyQrCode', '开始NFC扫描');

    try {
      // 实际项目中，这里应该使用Web NFC API
      // 模拟3秒后扫描到NFC
      setTimeout(() => {
        onNfcDetected({
          data: 'https://example.com/credential/6789'
        });
      }, 3000);
    } catch (error) {
      logger.error('Component:VerifyQrCode', 'NFC扫描失败', { error });
      isNfcScanning.value = false;
      alert('NFC扫描失败，请重试');
    }
  };

  // NFC检测成功
  const onNfcDetected = (result: { data: string }) => {
    logger.info('Component:VerifyQrCode', '检测到NFC标签', { data: result.data });

    // 添加扫描记录
    recentScans.value.unshift({
      type: 'NFC凭证',
      time: new Date().toISOString(),
      success: true
    });

    isNfcScanning.value = false;

    // 触发事件，通知父组件处理凭证数据
    emit('code-detected', result.data);
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 定义事件
  const emit = defineEmits(['code-detected']);
</script>

<style scoped>
  .btn-primary {
    @apply bg-neon text-black font-medium rounded-lg hover:bg-neon/90 transition-colors;
  }

  .btn-secondary {
    @apply bg-darkbg border border-gray-700 text-textlight font-medium rounded-lg hover:bg-primary/80 transition-colors;
  }

  @keyframes scan-move {
    0% {
      top: 0;
    }

    50% {
      top: 100%;
    }

    100% {
      top: 0;
    }
  }

  .animate-scan-move {
    animation: scan-move 2s linear infinite;
  }
</style>