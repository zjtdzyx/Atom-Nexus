# Clean script for Atom Nexus project (monorepo)
Write-Host "Starting to clean compiled files in Atom Nexus project..." -ForegroundColor Green

# 使用Try-Catch块处理可能的错误
try {
  # 首先，清理统一的dist目录（所有项目的构建输出）
  Write-Host "Cleaning unified dist directory..." -ForegroundColor Cyan
  if (Test-Path "./dist") {
    Remove-Item -Path "./dist" -Recurse -Force
  }

  # 清理自动生成的类型定义和配置文件
  Write-Host "Cleaning TypeScript declaration files and generated configs..." -ForegroundColor Cyan
  
  # 清理前端自动生成的文件
  Write-Host "Cleaning frontend generated files..." -ForegroundColor Cyan
  $frontendGeneratedFiles = @(
    "./frontend/vite.config.js",
    "./frontend/vite.config.js.map",
    "./frontend/vite.config.d.ts",
    "./frontend/uno.config.js",
    "./frontend/uno.config.js.map",
    "./frontend/uno.config.d.ts",
    "./frontend/components.d.ts",
    "./frontend/auto-imports.d.ts"
  )
  foreach ($file in $frontendGeneratedFiles) {
    if (Test-Path $file) {
      Remove-Item -Path $file -Force
    }
  }

  # 清理每个项目的临时目录
  Write-Host "Cleaning local build directories..." -ForegroundColor Cyan
  $localBuildDirs = @(
    "./frontend/dist",
    "./backend/dist",
    "./sdk/dist",
    "./sdk/lib",
    "./sdk/es",
    "./sdk/umd",
    "./smart-contracts/artifacts",
    "./smart-contracts/cache",
    "./smart-contracts/typechain",
    "./smart-contracts/typechain-types",
    "./smart-contracts/forge-cache",
    "./smart-contracts/.openzeppelin"
  )
  foreach ($dir in $localBuildDirs) {
    if (Test-Path $dir) {
      Remove-Item -Path $dir -Recurse -Force
    }
  }

  # Clean TypeScript build artifacts (跳过node_modules目录和配置文件)
  Write-Host "Cleaning TypeScript build artifacts..." -ForegroundColor Cyan
  $directories = @("./backend", "./sdk", "./smart-contracts", "./frontend")
  foreach ($dir in $directories) {
    if (Test-Path $dir) {
      Get-ChildItem -Path $dir -Recurse -Include "*.js", "*.js.map", "*.d.ts" | Where-Object {
        # 排除配置文件
        $_.FullName -notmatch "^.*[/\\](node_modules|dist)[/\\].*$" -and
        $_.Name -notmatch "(jest|babel|rollup|webpack|vite)\.config\.js" -and 
        $_.Name -ne ".eslintrc.js" -and 
        $_.Name -ne "prettier.config.js" -and
        $_.Name -ne "commitlint.config.js" -and
        # 排除package.json所在目录中的配置文件
        -not (Test-Path (Join-Path $_.Directory.FullName "package.json") -PathType Leaf)
      } | ForEach-Object {
        Write-Host "  Removing: $($_.FullName)" -ForegroundColor Gray
        Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
      }
    }
  }

  # 清理根目录的临时文件
  Write-Host "Cleaning root directory temporary files..." -ForegroundColor Cyan
  if (Test-Path "./tsconfig.tsbuildinfo") {
    Remove-Item -Path "./tsconfig.tsbuildinfo" -Force
  }

  Write-Host "Cleaning completed successfully!" -ForegroundColor Green
}
catch {
  Write-Host "An error occurred during cleaning process:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host "Stack Trace: " $_.Exception.StackTrace -ForegroundColor Red
} 