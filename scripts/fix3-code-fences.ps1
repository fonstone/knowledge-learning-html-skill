$contentDir = "D:\00 Work\ai-web\rust-learning\content"
$fixCount = 0

Get-ChildItem -Path $contentDir -Recurse -Filter "*.md" | ForEach-Object {
    $path = $_.FullName
    $c = Get-Content -Path $path -Raw -Encoding UTF8
    if ($c -match '\[code\]' -or $c -match '\[/code\]') {
        $c2 = $c -replace '(?m)^\s*\[code\]\s*$', '```'
        $c2 = $c2 -replace '(?m)^\s*\[/code\]\s*$', '```'
        if ($c2 -ne $c) {
            $relative = $path.Substring($contentDir.Length + 1)
            Write-Host "FIXED: $relative"
            Set-Content -Path $path -Value $c2 -NoNewline -Encoding UTF8
            $fixCount++
        }
    }
}
Write-Host "Fixed $fixCount files ([code] fence conversion)"
