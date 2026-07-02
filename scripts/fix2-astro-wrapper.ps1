$contentDir = "D:\00 Work\ai-web\rust-learning\content"
$fixCount = 0
$marker = 'id="article-content"'

for ($ch = 9; $ch -le 16; $ch++) {
    $chStr = $ch.ToString('00')
    Get-ChildItem -Path $contentDir -Filter "$chStr-*" -Directory | ForEach-Object {
        $dir = $_.FullName
        Get-ChildItem -Path $dir -Filter "*.md" | ForEach-Object {
            $path = $_.FullName
            $c = Get-Content -Path $path -Raw -Encoding UTF8
            $idx = $c.IndexOf($marker)
            if ($idx -ge 0) {
                $tagEnd = $c.IndexOf('>', $idx)
                if ($tagEnd -ge 0) {
                    $innerStart = $tagEnd + 1
                    $scriptIdx = $c.LastIndexOf('<script')
                    if ($scriptIdx -gt $innerStart) {
                        $innerEnd = $scriptIdx
                    } else {
                        $innerEnd = $c.Length
                    }
                    $inner = $c.Substring($innerStart, $innerEnd - $innerStart)
                    # Replace HTML entities
                    $inner = $inner -replace '&#x3C;', '<'
                    $inner = $inner -replace '&lt;', '<'
                    $inner = $inner -replace '&#x3E;', '>'
                    $inner = $inner -replace '&gt;', '>'
                    $inner = $inner -replace '&#x27;', "'"
                    $inner = $inner -replace '&#x26;', '&'
                    $inner = $inner -replace '&amp;', '&'
                    # Remove Astro data attributes
                    $inner = $inner -replace '\s+data-astro-cid-[a-zA-Z0-9-]+', ''
                    $inner = $inner.TrimStart()
                    $relative = $path.Substring($contentDir.Length + 1)
                    Write-Host "FIXED: $relative"
                    Set-Content -Path $path -Value $inner -NoNewline -Encoding UTF8
                    $fixCount++
                }
            }
        }
    }
}
Write-Host "Fixed $fixCount files (Astro wrapper removal)"
