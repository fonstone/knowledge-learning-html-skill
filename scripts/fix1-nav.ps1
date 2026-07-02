$contentDir = "D:\00 Work\ai-web\rust-learning\content"
$fixCount = 0
$lq = [char]0x2039

Get-ChildItem -Path $contentDir -Recurse -Filter "*.md" | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -Path $path -Raw -Encoding UTF8
    $lines = $content -split "`n"
    if ($lines.Count -ge 9) {
        $line5 = $lines[4].Trim()
        if ($line5 -eq $lq) {
            $newLines = @()
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($i -lt 4 -or $i -gt 8) {
                    $newLines += $lines[$i]
                }
            }
            $newContent = $newLines -join "`n"
            $relative = [System.IO.Path]::GetRelativePath($contentDir, $path)
            Write-Host "FIXED: $relative"
            Set-Content -Path $path -Value $newContent -NoNewline -Encoding UTF8
            $fixCount++
        }
    }
}
Write-Host "Fixed $fixCount files (nav artifact removal)"
