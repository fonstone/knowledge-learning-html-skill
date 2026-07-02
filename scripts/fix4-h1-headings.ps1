$contentDir = "D:\00 Work\ai-web\rust-learning\content"
$fixCount = 0

$indexPaths = @(
    "06-type-system\00-index.md"
    "07-modules\00-index.md"
    "08-engineering\00-index.md"
)
$indexTitles = @{
    "06-type-system\00-index.md" = "类型系统"
    "07-modules\00-index.md" = "模块系统"
    "08-engineering\00-index.md" = "项目工程化"
}

foreach ($path in $indexPaths) {
    $fullPath = Join-Path $contentDir $path
    if (Test-Path $fullPath) {
        $c = Get-Content -Path $fullPath -Raw -Encoding UTF8
        if ($c -notmatch '^# ') {
            $title = $indexTitles[$path]
            $c = "# $title`n`n$c"
            Write-Host "FIXED: $path"
            Set-Content -Path $fullPath -Value $c -NoNewline -Encoding UTF8
            $fixCount++
        }
    }
}
Write-Host "Fixed $fixCount files (H1 headings)"
