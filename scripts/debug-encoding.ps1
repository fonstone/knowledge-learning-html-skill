$path = "D:\00 Work\ai-web\rust-learning\content\03-ownership\01-memory-and-move.md"
$content = Get-Content -Path $path -Raw
$lines = $content -split "`n"
for ($i = 0; $i -le 10; $i++) {
    $trimmed = $lines[$i].Trim()
    $codes = $trimmed.ToCharArray() | ForEach-Object { [int]$_ }
    $codeStr = $codes -join ','
    Write-Host ("Line " + $i + ": length=" + $trimmed.Length + " codes=" + $codeStr)
}
