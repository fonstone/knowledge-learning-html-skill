param(
    [switch]$WhatIf
)

$contentDir = "D:\00 Work\ai-web\rust-learning\content"
$errors = 0

function Fix-File {
    param($Path, $Transform)
    try {
        $content = Get-Content -Path $Path -Raw -ErrorAction Stop
        $original = $content
        $content = & $Transform $content
        if ($content -ne $original) {
            if (-not $WhatIf) {
                Set-Content -Path $Path -Value $content -NoNewline -Encoding UTF8
            }
            $relative = [System.IO.Path]::GetRelativePath($contentDir, $Path)
            Write-Host "  FIXED: $relative" -ForegroundColor Green
            return $true
        }
    } catch {
        $relative = [System.IO.Path]::GetRelativePath($contentDir, $Path)
        Write-Host "  ERROR: $relative - $_" -ForegroundColor Red
        $script:errors++
    }
    return $false
}

# ============================================================
# FIX 1: Remove nav artifacts (lines 5-9 with ‹/›)
# ============================================================
Write-Host "`n=== Fix 1: Removing nav artifacts ===" -ForegroundColor Cyan
$fix1Count = 0
Get-ChildItem -Path $contentDir -Recurse -Filter "*.md" | ForEach-Object {
    if (Fix-File $_.FullName {
        param($c)
        $lines = $c -split "`n"
        if ($lines.Count -ge 10) {
            $line5 = $lines[4].Trim()
            if ($line5 -eq [char]0x2039 -or $line5 -eq "‹") {
                $newLines = @()
                for ($i = 0; $i -lt $lines.Count; $i++) {
                    if ($i -lt 4 -or $i -gt 8) {
                        $newLines += $lines[$i]
                    }
                }
                return ($newLines -join "`n")
            }
        }
        $c
    }) { $fix1Count++ }
}
Write-Host "  Fixed $fix1Count files" -ForegroundColor Yellow

# ============================================================
# FIX 2: Strip Astro HTML wrapper from chapters 09-16
# ============================================================
Write-Host "`n=== Fix 2: Stripping Astro HTML wrapper (ch09-16) ===" -ForegroundColor Cyan
$fix2Count = 0

for ($ch = 9; $ch -le 16; $ch++) {
    $chStr = $ch.ToString('00')
    Get-ChildItem -Path $contentDir -Filter "$chStr-*" -Directory | ForEach-Object {
        $dir = $_.FullName
        Get-ChildItem -Path $dir -Filter "*.md" | ForEach-Object {
            if (Fix-File $_.FullName {
                param($c)
                $marker = 'id="article-content"'
                $idx = $c.IndexOf($marker)
                if ($idx -ge 0) {
                    # Find the > after the marker
                    $tagEnd = $c.IndexOf('>', $idx)
                    if ($tagEnd -ge 0) {
                        $innerStart = $tagEnd + 1
                        # Find closing </div></div><script
                        $scriptMarker = '</div>'
                        # Look for the pattern </div></div><script from the end
                        $searchFrom = $c.Length - 1
                        # Find last </div> before a <script tag
                        $scriptIdx = $c.LastIndexOf('<script')
                        if ($scriptIdx -gt $innerStart) {
                            # Work backwards from scriptIdx to find preceding </div></div>
                            $beforeScript = $c.Substring(0, $scriptIdx).TrimEnd()
                            if ($beforeScript.EndsWith('</div>')) {
                                $innerEnd = $beforeScript.LastIndexOf('</div>')
                                if ($innerEnd -gt 0) {
                                    $innerEnd = $beforeScript.LastIndexOf('</div>', $innerEnd - 1)
                                }
                            }
                            if ($null -eq $innerEnd -or $innerEnd -lt $innerStart) {
                                $innerEnd = $scriptIdx
                            }
                        } else {
                            $innerEnd = $c.Length
                        }
                        
                        $inner = $c.Substring($innerStart, $innerEnd - $innerStart)
                        
                        # Replace HTML entities
                        $replacements = @{
                            '&#x3C;' = '<'
                            '&lt;' = '<'
                            '&#x3E;' = '>'
                            '&gt;' = '>'
                            '&#x27;' = "'"
                            '&#x26;' = '&'
                            '&amp;' = '&'
                        }
                        foreach ($key in $replacements.Keys) {
                            $inner = $inner -replace [regex]::Escape($key), $replacements[$key]
                        }
                        
                        # Remove Astro data attributes
                        $inner = $inner -replace '\s+data-astro-cid-[a-zA-Z0-9-]+', ''
                        
                        return $inner.TrimStart()
                    }
                }
                $c
            }) { $fix2Count++ }
        }
    }
}
Write-Host "  Fixed $fix2Count files" -ForegroundColor Yellow

# ============================================================
# FIX 3: Convert [code]/[/code] to ``` fences
# ============================================================
Write-Host "`n=== Fix 3: Converting [code]/[/code] to ``` ===" -ForegroundColor Cyan
$fix3Count = 0
Get-ChildItem -Path $contentDir -Recurse -Filter "*.md" | ForEach-Object {
    if (Fix-File $_.FullName {
        param($c)
        $c2 = $c -replace '(?m)^\s*\[code\]\s*$', '```'
        $c2 = $c2 -replace '(?m)^\s*\[/code\]\s*$', '```'
        $c2
    }) { $fix3Count++ }
}
Write-Host "  Fixed $fix3Count files" -ForegroundColor Yellow

# ============================================================
# FIX 4: Add H1 to chapter index files
# ============================================================
Write-Host "`n=== Fix 4: Adding H1 to index files ===" -ForegroundColor Cyan
$fix4Count = 0
$indexFixes = @(
    @{RelPath="06-type-system\00-index.md"; Title="类型系统"},
    @{RelPath="07-modules\00-index.md"; Title="模块系统"},
    @{RelPath="08-engineering\00-index.md"; Title="项目工程化"}
)
foreach ($fix in $indexFixes) {
    $fullPath = Join-Path $contentDir $fix.RelPath
    if (Test-Path $fullPath) {
        if (Fix-File $fullPath {
            param($c)
            if ($c -notmatch '^# ') {
                "# $($fix.Title)`n`n$c"
            } else { $c }
        }) { $fix4Count++ }
    }
}
Write-Host "  Fixed $fix4Count files" -ForegroundColor Yellow

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "  Fix 1 (nav artifacts): $fix1Count" -ForegroundColor Yellow
Write-Host "  Fix 2 (Astro wrapper): $fix2Count" -ForegroundColor Yellow
Write-Host "  Fix 3 ([code] fences): $fix3Count" -ForegroundColor Yellow
Write-Host "  Fix 4 (H1 headings): $fix4Count" -ForegroundColor Yellow
Write-Host "  Total: $($fix1Count + $fix2Count + $fix3Count + $fix4Count)" -ForegroundColor Yellow
if ($errors -gt 0) {
    Write-Host "  Errors: $errors" -ForegroundColor Red
}
Write-Host "Done!"
