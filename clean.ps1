# Clean script for Atom Nexus project (monorepo)
Write-Host "Starting to clean compiled files in Atom Nexus project..." -ForegroundColor Green

# 使用Try-Catch块处理可能的错误
try {
  # 直接删除已知的前端编译文件
  Write-Host "Cleaning frontend compiled files..." -ForegroundColor Cyan
  if (Test-Path "./frontend/vite.config.js") {
    Remove-Item -Path "./frontend/vite.config.js" -Force
  }
  if (Test-Path "./frontend/vite.config.js.map") {
    Remove-Item -Path "./frontend/vite.config.js.map" -Force
  }
    
  # 清理前端dist目录
  if (Test-Path "./frontend/dist") {
    Remove-Item -Path "./frontend/dist" -Recurse -Force
  }

  # Clean TypeScript build artifacts (跳过node_modules目录)
  Write-Host "Cleaning TypeScript build artifacts..." -ForegroundColor Cyan
  $directories = @("./backend", "./sdk", "./smart-contracts")
  foreach ($dir in $directories) {
    if (Test-Path $dir) {
      Get-ChildItem -Path $dir -Recurse -Include "*.js", "*.js.map", "*.d.ts" -Exclude "node_modules", "dist" | Where-Object {
        # 排除配置文件
        $_.Name -notmatch "(jest|babel|rollup|webpack|vite)\.config\.js" -and 
        $_.Name -ne ".eslintrc.js" -and 
        $_.Name -ne "prettier.config.js" -and
        $_.Name -ne "commitlint.config.js" -and
        # 排除node_modules内的文件
        $_.FullName -notmatch "node_modules"
      } | Remove-Item -Force -ErrorAction SilentlyContinue
    }
  }

  # Clean backend files
  Write-Host "Cleaning backend files..." -ForegroundColor Cyan
  Remove-Item -Path "./backend/dist" -Recurse -Force -ErrorAction SilentlyContinue

  # Clean SDK files
  Write-Host "Cleaning SDK files..." -ForegroundColor Cyan
  Remove-Item -Path "./sdk/dist", "./sdk/lib", "./sdk/es", "./sdk/umd" -Recurse -Force -ErrorAction SilentlyContinue

  # Clean smart contract files
  Write-Host "Cleaning smart contract files..." -ForegroundColor Cyan
  Remove-Item -Path "./smart-contracts/artifacts", "./smart-contracts/cache", "./smart-contracts/typechain", "./smart-contracts/typechain-types" -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -Path "./smart-contracts/out", "./smart-contracts/forge-cache", "./smart-contracts/.openzeppelin" -Recurse -Force -ErrorAction SilentlyContinue

  Write-Host "Cleaning completed!" -ForegroundColor Green
}
catch {
  Write-Host "An error occurred during cleaning process:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host "Stack Trace: " $_.Exception.StackTrace -ForegroundColor Red
} 