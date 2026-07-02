$path = "D:\00 Work\ai-web\rust-learning\content\03-ownership\01-memory-and-move.md"
$content = Get-Content -Path $path -Raw -Encoding UTF8
$lines = $content -split "`n"
Write-Host "Total lines: " $lines.Length
for ($i = 0; $i -le 9; $i++) {
    $trimmed = $lines[$i].Trim()
    $codes = $trimmed.ToCharArray() | ForEach-Object { [int]$_ }
    $codeStr = $codes -join ','
    Write-Host ("Line " + $i + ": length=" + $trimmed.Length + " codes=" + $codeStr)
}
# Check specifically for 0x2039 and 0x203A
$hasLQ = $content.IndexOf([char]0x2039)
$hasRQ = $content.IndexOf([char]0x203A)
Write-Host "Has ‹ (U+2039) at index: $hasLQ"
Write-Host "Has › (U+203A) at index: $hasRQ"
