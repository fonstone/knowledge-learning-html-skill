$ErrorActionPreference = 'Stop'
$base = Split-Path -Parent $PSScriptRoot

$srcDir = Join-Path $base 'content'
$destDir = Join-Path $base 'src\content\lessons'

Remove-Item -Recurse -Force -LiteralPath $destDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

# Read data.js and extract the JSON array
$dataContent = Get-Content -Raw -LiteralPath (Join-Path $base 'js\data.js') -Encoding UTF8
$dataContent = $dataContent -replace '^const courseData = ', ''
$dataContent = $dataContent -creplace ';\s*$', ''

# Convert JS-like JSON to proper JSON (remove trailing commas in arrays)
# The data.js file uses proper JSON inside the array, so we can parse it directly
# But need to handle JS-style property names (they're already quoted in the source)
try {
    $chapters = $dataContent | ConvertFrom-Json
} catch {
    # If direct parsing fails, try more aggressive JS->JSON conversion
    $dataContent = $dataContent -replace ',(\s*[}\]])', '$1'
    $chapters = $dataContent | ConvertFrom-Json
}

$count = 0
foreach ($ch in $chapters) {
    $chId = $ch.id
    $chNum = $ch.number
    $chTitle = $ch.title

    $chDir = Join-Path $destDir $chId
    New-Item -ItemType Directory -Path $chDir -Force | Out-Null

    foreach ($ls in $ch.lessons) {
        $lsId = $ls.id
        $srcFile = Join-Path $srcDir "$chId\$lsId.md"
        $destFile = Join-Path $chDir "$lsId.md"

        if (-not (Test-Path -LiteralPath $srcFile)) {
            Write-Warning "Missing: $srcFile"
            continue
        }

        $body = Get-Content -Raw -LiteralPath $srcFile -Encoding UTF8

        # Build tags array - quote if contains special chars
        $tagParts = @()
        foreach ($t in $ls.tags) {
            if ($t -match '[:#\[\]{}&*!|>''"%@`\s]') {
                $tagParts += '"' + ($t -replace '"', '\"') + '"'
            } else {
                $tagParts += $t
            }
        }
        $tagsStr = '[' + ($tagParts -join ', ') + ']'

        # Build frontmatter
        $fm = @"
---
chapterId: "$chId"
lessonId: "$lsId"
title: "$($ls.title)"
level: "$($ls.level)"
duration: "$($ls.duration)"
tags: $tagsStr
number: "$($ls.number)"
chapterTitle: "$chTitle"
chapterNumber: "$chNum"
---

"@
        # Write with UTF8 no BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($destFile, $fm + $body, $utf8NoBom)
        $count++
    }
}

Write-Output "Done. Files processed: $count"
