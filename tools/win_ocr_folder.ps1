param(
    [Parameter(Mandatory = $true)][string]$InDir,
    [Parameter(Mandatory = $true)][string]$OutDir,
    [string]$Lang = 'zh-Hans-CN'
)

# Batch OCR with Windows.Media.Ocr (no tesseract needed).
# ASCII-only source: Windows PowerShell 5.1 misparses UTF-8 without BOM.

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
})[0]

function Await($op, [Type]$type) {
    $task = $asTask.MakeGenericMethod($type).Invoke($null, @($op))
    $task.Wait(-1) | Out-Null
    $task.Result
}

$language = [Windows.Globalization.Language]::new($Lang)
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
if (-not $engine) { throw "OCR language pack missing: $Lang" }

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$files = Get-ChildItem -Path $InDir -Filter *.png | Sort-Object Name
$i = 0
$chars = 0
$nl = [Environment]::NewLine
foreach ($file in $files) {
    $i++
    $storage = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName)) ([Windows.Storage.StorageFile])
    $stream = Await ($storage.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $lines = @()
    foreach ($line in $result.Lines) { $lines += $line.Text }
    $text = [string]::Join($nl, $lines)
    $out = Join-Path $OutDir ($file.BaseName + '.txt')
    [IO.File]::WriteAllText($out, $text, (New-Object Text.UTF8Encoding($false)))
    $chars += $text.Length
    $bitmap.Dispose()
    $stream.Dispose()
    if ($i % 25 -eq 0) { Write-Output ("ocr {0}/{1} chars={2}" -f $i, $files.Count, $chars) }
}
Write-Output ("ocr done files={0} chars={1}" -f $files.Count, $chars)
