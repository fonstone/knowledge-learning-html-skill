$ErrorActionPreference = 'Stop'
$base = Split-Path -Parent $PSScriptRoot

$srcDir = Join-Path $base 'content'
$destDir = Join-Path $base 'src\content\lessons'

Remove-Item -Recurse -Force -LiteralPath $destDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

$dataContent = Get-Content -Raw -LiteralPath (Join-Path $base 'js\data.js') -Encoding UTF8

# Use node to parse the JavaScript data properly  
$json = & node -e @"
const courseData = $dataContent;
console.log(JSON.stringify(courseData));
"@

if ($LASTEXITCODE -ne 0) { throw "Node parse failed" }
$chapters = $json | ConvertFrom-Json

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

        # Read the source file as raw bytes to preserve encoding
        $bodyBytes = [System.IO.File]::ReadAllBytes($srcFile)
        $body = [System.Text.Encoding]::UTF8.GetString($bodyBytes)

        # Build tags array - quote every tag to be safe
        $tagParts = @()
        foreach ($t in $ls.tags) {
            $escaped = $t -replace '\\', '\\\\' -replace '"', '\"'
            $tagParts += '"' + $escaped + '"'
        }
        $tagsStr = '[' + ($tagParts -join ', ') + ']'

        $titleEscaped = $ls.title -replace '"', '\"'
        $levelEscaped = $ls.level -replace '"', '\"'
        $durationEscaped = $ls.duration -replace '"', '\"'
        $numberEscaped = $ls.number -replace '"', '\"'
        $chTitleEscaped = $chTitle -replace '"', '\"'
        $chNumEscaped = $chNum -replace '"', '\"'

        $fm = @"
---
chapterId: "$chId"
lessonId: "$lsId"
title: "$titleEscaped"
level: "$levelEscaped"
duration: "$durationEscaped"
tags: $tagsStr
number: "$numberEscaped"
chapterTitle: "$chTitleEscaped"
chapterNumber: "$chNumEscaped"
---

"@
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($destFile, $fm + $body, $utf8NoBom)
        $count++
    }
}

Write-Output "Done. Files processed: $count"
