$baseUrl = "https://xyfx-fhw.github.io/RustCourse/chapters"
$outputRoot = "D:\00 Work\ai-web\rust-learning\content"

$pages = @(
    @{chapter="05-stdlib-types"; lesson="03-hashmaps"},
    @{chapter="05-stdlib-types"; lesson="04-practice"},
    @{chapter="06-type-system"; lesson="00-index"},
    @{chapter="06-type-system"; lesson="01-type-inference"},
    @{chapter="06-type-system"; lesson="02-type-casting"},
    @{chapter="06-type-system"; lesson="03-type-aliases"},
    @{chapter="06-type-system"; lesson="04-newtype-pattern"},
    @{chapter="07-modules"; lesson="00-index"},
    @{chapter="07-modules"; lesson="01-packages-crates"},
    @{chapter="07-modules"; lesson="02-modules"},
    @{chapter="07-modules"; lesson="03-paths-use"},
    @{chapter="08-engineering"; lesson="00-index"},
    @{chapter="08-engineering"; lesson="01-workspace"},
    @{chapter="08-engineering"; lesson="02-build-scripts"},
    @{chapter="08-engineering"; lesson="03-doc-comments"}
)

foreach ($page in $pages) {
    $url = "$($baseUrl)/$($page.chapter)/$($page.lesson)/"
    $outDir = Join-Path $outputRoot $page.chapter
    $outFile = Join-Path $outDir "$($page.lesson).md"

    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

    Write-Host "Fetching: $url"
    $content = Invoke-WebRequest -Uri $url -UseBasicParsing | Select-Object -ExpandProperty Content

    # Find first # heading
    $hashIdx = $content.IndexOf("# ")
    if ($hashIdx -ge 0) {
        $start = $hashIdx
    } else {
        Write-Host "  WARN: No # heading found"
        continue
    }

    # Find stop markers using simple byte-level search for known patterns
    $stops = @()
    # [← 上一节
    $idx = $content.IndexOf("[← ", $start)
    if ($idx -ge 0) { $stops += $idx }
    # [下一节 →
    $idx = $content.IndexOf("[下一节", $start)
    if ($idx -ge 0) { $stops += $idx }
    # 目录 (standalone heading)
    $idx = $content.IndexOf("`n目录`n", $start)
    if ($idx -ge 0) { $stops += $idx }
    # Also try "目录`n" at start of line
    $idx = $content.IndexOf("`n目录`r`n", $start)
    if ($idx -ge 0) { $stops += $idx }

    if ($stops.Count -gt 0) {
        $stops = $stops | Sort-Object
        $stop = $stops[0]
    } else {
        $stop = $content.Length
        Write-Host "  WARN: No stop marker found"
    }

    $extracted = $content.Substring($start, $stop - $start).Trim()
    [System.IO.File]::WriteAllText($outFile, $extracted, [System.Text.Encoding]::UTF8)
    $size = (Get-Item $outFile).Length
    Write-Host "  Saved: $outFile ($size bytes)"
}
