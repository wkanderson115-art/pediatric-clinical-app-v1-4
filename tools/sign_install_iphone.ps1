# 用 Sideloadly 在 Windows 上给已连接的 iPhone 签名并安装 IPA（无人值守参数版）
#
# 用法（在本机 PowerShell 里执行）：
#   .\tools\sign_install_iphone.ps1 -Ipa "D:\360MoveData\Users\Dell\Desktop\PediatricClinicalApp_V1.7.2_两本书版_装这个.ipa" `
#       -AppleId "你的AppleID邮箱" -Password "密码"
#
# 说明：
# - Sideloadly 会向 Apple 申请免费开发证书（有效期 7 天），首次会弹双因素验证，输入手机收到的 6 位码即可。
# - 安装完成后 iPhone：设置 → 通用 → VPN 与设备管理 → 开发者 App → 信任你的 Apple ID。
# - 需要 iPod/iPhone 已用 USB 连接、解锁并点“信任此电脑”。
param(
    [Parameter(Mandatory = $true)][string]$Ipa,
    [Parameter(Mandatory = $true)][string]$AppleId,
    [string]$Password = "",
    [string]$Sideloadly = "$env:LOCALAPPDATA\Sideloadly\sideloadly.exe"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $Ipa)) { throw "找不到 IPA：$Ipa" }
if (-not (Test-Path $Sideloadly)) {
    $candidates = @(
        "$env:LOCALAPPDATA\Programs\Sideloadly\sideloadly.exe",
        "$env:ProgramFiles\Sideloadly\sideloadly.exe",
        "${env:ProgramFiles(x86)}\Sideloadly\sideloadly.exe"
    )
    $Sideloadly = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
}
if (-not $Sideloadly) {
    throw "未安装 Sideloadly。先运行安装包：_tools\SideloadlySetup64.exe（或 https://sideloadly.io 下载），装完重跑本脚本。"
}

Write-Host "== 检查设备 ==" -ForegroundColor Cyan
Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue |
    Where-Object { $_.FriendlyName -match 'Apple iPhone' } |
    Select-Object FriendlyName, Status | Format-Table -AutoSize | Out-Host

$args = @("-ipa", "`"$Ipa`"", "--appleid", "`"$AppleId`"")
if ($Password) { $args += @("--password", "`"$Password`"") }

Write-Host "== 开始签名并安装（首次会要求双因素验证码）==" -ForegroundColor Cyan
Write-Host "$Sideloadly $($args -join ' ')"

$proc = Start-Process -FilePath $Sideloadly -ArgumentList ($args -join ' ') -PassThru -Wait
Write-Host "Sideloadly 退出码：$($proc.ExitCode)"

Write-Host "== 校验是否安装到设备（读设备应用列表）==" -ForegroundColor Cyan
$idevice = Get-ChildItem "C:\Program Files (x86)\i4Tools9" -Recurse -Include ideviceinstaller.exe -ErrorAction SilentlyContinue | Select-Object -First 1
if ($idevice) {
    & $idevice.FullName -U all | Select-String -Pattern "pediatricclinical|儿科" | Select-Object -First 5
} else {
    Write-Host "未找到 ideviceinstaller.exe；请在 iPhone 主屏确认是否出现“儿科临床药典”图标。" -ForegroundColor Yellow
}

Write-Host @"

安装后必做：
1) iPhone：设置 → 通用 → VPN 与设备管理 → 开发者 App → 信任你的 Apple ID
2) 打开 App，右上角应显示 V1.7.2 离线书库
3) 工具 → 离线书库 → 书架应有 2 本（速查书 676 块 + NICE NG1 50 块）

免费 Apple ID 签名 7 天到期，重装一次即可；如需长期，用付费开发者证书走 .github/workflows/ios-signed-build.yml。
"@ -ForegroundColor Green
