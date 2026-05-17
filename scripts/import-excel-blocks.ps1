param(
  [string]$WorkbookPath = "Trainingen-junioren-25-26.xlsx",
  [string]$OutputRoot = "content/blokken"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-ColIndex([string]$letters) {
  $value = 0
  foreach ($char in $letters.ToUpperInvariant().ToCharArray()) {
    $value = ($value * 26) + ([int][char]$char - [int][char]'A' + 1)
  }
  return $value
}

function Get-ColName([int]$index) {
  $name = ""
  while ($index -gt 0) {
    $index--
    $name = [char]([int][char]'A' + ($index % 26)) + $name
    $index = [math]::Floor($index / 26)
  }
  return $name
}

function Get-Slug([string]$value) {
  $normalized = $value.ToLowerInvariant().Normalize([Text.NormalizationForm]::FormD)
  $builder = [Text.StringBuilder]::new()
  foreach ($char in $normalized.ToCharArray()) {
    $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($char)
    if ($category -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($char)
    }
  }
  return ($builder.ToString() -replace "[^a-z0-9]+", "-" -replace "^-+|-+$", "")
}

function Get-Sha1([string]$value) {
  $sha = [Security.Cryptography.SHA1]::Create()
  $bytes = [Text.Encoding]::UTF8.GetBytes($value)
  return (($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join "")
}

function Read-EntryXml($zip, [string]$name) {
  $entry = $zip.GetEntry($name)
  if (-not $entry) {
    throw "Excel-entry ontbreekt: $name"
  }
  $reader = [IO.StreamReader]::new($entry.Open())
  $text = $reader.ReadToEnd()
  $reader.Close()
  return [xml]$text
}

function Get-CellValue($cell, [string[]]$sharedStrings) {
  if ($cell.t -eq "inlineStr") {
    return Normalize-CellText ([string]$cell.is.InnerText)
  }
  if ($null -eq $cell.v) {
    return $null
  }
  $value = [string]$cell.v
  if ($cell.t -eq "s") {
    return Normalize-CellText $sharedStrings[[int]$value]
  }
  return Normalize-CellText $value
}

function Normalize-CellText([string]$value) {
  if ($null -eq $value) { return $null }
  $text = $value.Trim()
  $text = $text.Replace([char]0x1D49, "e")
  $text = $text.Replace([char]0x1D48, "d")
  $text = $text -replace "(?i)\br\s*:\s*(\d+)\s*sec\b", 'R:0:$1'
  $text = $text -replace "(?i)\br\s*(\d+)\s*sec\b", 'R:0:$1'
  $text = $text -replace "(?i)(\d)(bc|rc|ss|vl|wis|ws|snk)\b", '$1 $2'
  $text = $text -replace "(?i)\bbc\b", "BC"
  $text = $text -replace "(?i)\brc\b", "RC"
  $text = $text -replace "(?i)\bss\b", "SS"
  $text = $text -replace "(?i)\bvl\b", "VL"
  $text = $text -replace "(?i)\bwis\b", "WIS"
  $text = $text -replace "(?i)\bws\b", "WIS"
  $text = $text -replace "(?i)\bsnk\b", "SNK"
  return $text
}

function Read-Workbook([string]$path) {
  $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $path))
  try {
    $sharedXml = Read-EntryXml $zip "xl/sharedStrings.xml"
    $sharedStrings = @($sharedXml.sst.si | ForEach-Object { $_.InnerText })
    $workbookXml = Read-EntryXml $zip "xl/workbook.xml"
    $relsXml = Read-EntryXml $zip "xl/_rels/workbook.xml.rels"

    $relMap = @{}
    foreach ($rel in $relsXml.Relationships.Relationship) {
      $relMap[$rel.Id] = $rel.Target
    }

    $sheets = @()
    foreach ($sheet in $workbookXml.workbook.sheets.sheet) {
      $target = $relMap[$sheet.id]
      $sheetXml = Read-EntryXml $zip "xl/$target"
      $rows = @{}
      $maxRow = 0
      $maxCol = 0

      foreach ($row in $sheetXml.worksheet.sheetData.row) {
        $rowIndex = [int]$row.r
        $maxRow = [math]::Max($maxRow, $rowIndex)
        $rowMap = @{}
        foreach ($cell in $row.c) {
          if ($cell.r -match "^([A-Z]+)(\d+)$") {
            $col = Get-ColIndex $Matches[1]
            $maxCol = [math]::Max($maxCol, $col)
            $value = Get-CellValue $cell $sharedStrings
            if ($null -ne $value -and "$value".Trim() -ne "") {
              $rowMap[$col] = "$value".Trim()
            }
          }
        }
        if ($rowMap.Count -gt 0) {
          $rows[$rowIndex] = $rowMap
        }
      }

      $sheets += [pscustomobject]@{
        Name = [string]$sheet.name
        Rows = $rows
        MaxRow = $maxRow
        MaxCol = $maxCol
      }
    }
    return $sheets
  }
  finally {
    $zip.Dispose()
  }
}

function Get-Cell($sheet, [int]$row, [int]$col) {
  if (-not $sheet.Rows.ContainsKey($row)) {
    return $null
  }
  return $sheet.Rows[$row][$col]
}

function Find-StartCol($sheet, [int]$row, [int]$metaCol) {
  for ($col = $metaCol - 1; $col -ge [math]::Max(1, $metaCol - 8); $col--) {
    $value = Get-Cell $sheet $row $col
    if ($value) {
      return $col
    }
  }
  return [math]::Max(1, $metaCol - 4)
}

function Convert-DurationMinutes([string]$value) {
  if (-not $value) { return $null }
  if ($value -match "(\d+)") { return [int]$Matches[1] }
  return $null
}

function Convert-Distance([string]$value) {
  if (-not $value) { return $null }
  if ($value -match "(\d+)") { return [int]$Matches[1] }
  return $null
}

function Get-SlagFocus([string]$sheetName, [string]$title, [string]$theme, [string[]]$lines) {
  $text = (($sheetName, $title, $theme) + $lines) -join " "
  $upper = $text.ToUpperInvariant()
  $strokeMatches = @()
  if ($upper -match "\bBC\b|BORSTCRAWL") { $strokeMatches += "BC" }
  if ($upper -match "\bRC\b|RUGCRAWL|RUG") { $strokeMatches += "RC" }
  if ($upper -match "\bSS\b|SCHOOLSLAG|BORST") { $strokeMatches += "SS" }
  if ($upper -match "\bVL\b|VLINDER|VLI") { $strokeMatches += "VL" }
  if ($upper -match "\bWIS\b|\bWS\b|WISSEL") { $strokeMatches += "WIS" }
  $strokeMatches = @($strokeMatches | Select-Object -Unique)
  if ($strokeMatches.Count -eq 1) { return $strokeMatches[0] }
  if ($sheetName -eq "Inzwemmen") { return "Alle slagen" }
  if ($sheetName -eq "Overig") { return "Alle slagen" }
  if ($sheetName -eq "WS") { return "WIS" }
  if (@("BC", "SS", "RC", "VL") -contains $sheetName) { return $sheetName }
  return "Alle slagen"
}

function Get-BlockType([string]$section, [string]$sheetName, [string]$theme) {
  if ($section -eq "INZWEMMEN" -or $sheetName -eq "Inzwemmen") { return "inzwemmen" }
  if ($theme -match "conditie|duur|aerobe|anaerobe|capaciteit|tempo|lactaat") { return "conditieblok" }
  return "kernblok"
}

function Get-Tags([string]$sheetName, [string]$type, [string]$theme, [string]$slagfocus) {
  $tags = @($type, $slagfocus)
  if ($sheetName -notmatch "^\d{4}$") {
    $tags += $sheetName
  }
  $lower = $theme.ToLowerInvariant()
  foreach ($word in @("techniek", "conditie", "tempo", "sprint", "herstel", "keerpunten", "aerobe", "anaerobe", "duur")) {
    if ($lower.Contains($word)) { $tags += $word }
  }
  return @($tags | Where-Object { $_ -and $_ -ne "" } | ForEach-Object { Get-Slug $_ } | Select-Object -Unique)
}

function Get-Category([string]$type, [string]$theme, [string]$title, [string]$sheetName) {
  $text = "$theme $title $sheetName".ToLowerInvariant()

  if ($type -eq "inzwemmen") { return "inzwemmen" }
  if ($text -match "herstel|snk") { return "herstel" }
  if ($text -match "keerpunten|keerpunt|start") { return "keerpunten" }
  if ($text -match "sprint|snelheid|anaeroob vermogen|hard") { return "sprint" }
  if ($text -match "wedstrijdtempo|tempo|omslagpunt|lactaat") { return "tempo" }
  if ($text -match "techniek|ligging|inzet|doorhaal|adembeperking") { return "techniek" }
  if ($text -match "conditie|duur|aerobe|anaerobe|capaciteit|uithouding") { return "conditie" }
  return "overig"
}

function Get-StrokeFolder([string]$slagfocus) {
  switch ($slagfocus) {
    "BC" { return "bc" }
    "RC" { return "rc" }
    "SS" { return "ss" }
    "VL" { return "vl" }
    "WIS" { return "wis" }
    "Alle slagen" { return "alle-slagen" }
    default { return Get-Slug $slagfocus }
  }
}

function Convert-ExcelDate([string]$value) {
  if (-not $value) { return $null }
  if ($value -match "^\d+(\.\d+)?$") {
    return ([datetime]"1899-12-30").AddDays([double]$value).ToString("yyyy-MM-dd")
  }
  return $null
}

function Get-CoachTip([string]$line, [string]$type, [string]$theme, [string]$slagfocus) {
  $lower = $line.ToLowerInvariant()
  $themeLower = $theme.ToLowerInvariant()

  if ($type -eq "inzwemmen") {
    if ($lower -match "snk|herstel") { return "gebruik deze serie als reset en laat ademhaling en schouders ontspannen" }
    if ($lower -match "wis") { return "bewaak de vaste wisselslagvolgorde en houd elke overgang ontspannen" }
    if ($lower -match "\bb\b|\ba\b|benen|armen") { return "kijk of benen en armen in de volledige slag hetzelfde ritme houden" }
    if ($lower -match "hard|8[0-9]\s*%|9[0-9]\s*%|start|kp|keer") { return "laat het tempo geleidelijk oplopen zonder dat de slag korter wordt" }
    return "laat rustig starten en controleer of techniek en ademhaling ontspannen blijven"
  }

  if ($lower -match "snk|herstel") { return "laat de hartslag zakken en bewaak dat de techniek niet slordig wordt" }
  if ($lower -match "sprint|hard|\b9[0-9]\s*%|\b100\s*%|race pace") { return "stuur op hoge kwaliteit: strakke lijn, vaste timing en volledig herstel tussen de herhalingen" }
  if ($lower -match "keerpunt|afzet|onderwater|owf|start") { return "kijk naar een compacte draai, krachtige afzet en stabiele stroomlijn na de muur" }
  if ($themeLower -match "aerobe|duur|conditie|capaciteit|uithouding") { return "stuur op gelijkmatige doorkomst en behoud van slaglengte naarmate de serie langer wordt" }
  if ($themeLower -match "tempo|omslagpunt") { return "bewaak dat het tempo uit timing komt en niet uit korter trekken" }
  if ($slagfocus -eq "BC") { return "let op lange ligging, rustige ademhaling en een versnelling in de doorhaal" }
  if ($slagfocus -eq "RC") { return "let op stabiele hoofdpositie, hoge heupen en een ritmische armslag" }
  if ($slagfocus -eq "SS") { return "bewaak de timing tussen ademhaling, armslag en beenslag zodat de lijn lang blijft" }
  if ($slagfocus -eq "VL") { return "laat de beweging vanuit de heupen komen en voorkom dat de armen de slag gaan trekken" }
  if ($slagfocus -eq "WIS") { return "bewaak de volgorde en laat elke overgang met dezelfde technische aandacht zwemmen" }
  if ($themeLower -match "techniek") { return "kies een helder aandachtspunt en laat de zwemmers dat per herhaling vasthouden" }
  return "controleer of de opdracht technisch netjes blijft en de intensiteit past bij het doel van het blok"
}

function Format-SetLine([string[]]$values, [string]$type, [string]$theme, [string]$slagfocus) {
  $parts = @($values | Where-Object { $_ -and $_.Trim() -ne "" } | ForEach-Object { $_.Trim() })
  if ($parts.Count -eq 0) { return $null }

  if ($parts.Count -ge 2 -and $parts[0] -match "^\d+\s*x$" -and $parts[1] -match "^\d+\s*m$") {
    $combined = ($parts[0] -replace "\s+", "") + ($parts[1] -replace "\s+", "")
    $parts = if ($parts.Count -gt 2) { @($combined) + $parts[2..($parts.Count - 1)] } else { @($combined) }
  }

  $tokenCount = [math]::Min(3, $parts.Count)
  $tokens = @()
  $descriptions = @()
  for ($i = 0; $i -lt $parts.Count; $i++) {
    $part = $parts[$i]
    $isToken = $i -lt $tokenCount -and ($part -match "^\d+\s*x|^\d+\s*m$|^r\s*:|^r\s+\d|^s\s*:|^\d+%$|^[A-Za-z]{1,4}$")
    if ($isToken) {
      $tokens += ('`' + $part + '`')
    } else {
      $descriptions += $part
    }
  }

  $body = @($tokens + $descriptions) -join " - "
  $tip = Get-CoachTip ($parts -join " ") $type $theme $slagfocus
  return "- $body {{coach: $tip}}"
}

function Get-RowValues($sheet, [int]$row, [int]$startCol, [int]$endCol) {
  $values = @()
  for ($col = $startCol; $col -le $endCol; $col++) {
    $value = Get-Cell $sheet $row $col
    if ($value) { $values += $value }
  }
  return $values
}

function New-Block($sheet, [string]$section, [int]$startRow, [int]$endRow, [int]$startCol, [int]$endCol, [int]$metaCol, [string]$title, [string]$theme, [string]$duration, [string]$distance, [int]$contentStartRow, [string]$trainingDate) {
  $rawLines = @()
  for ($row = $contentStartRow; $row -le $endRow; $row++) {
    $values = Get-RowValues $sheet $row $startCol $endCol
    if ($values.Count -gt 0) {
      $rawLines += ,@($values)
    }
  }
  if ($rawLines.Count -eq 0) { return $null }

  $rawTextLines = @($rawLines | ForEach-Object { ($_ -join " | ") })
  $slagfocus = Get-SlagFocus $sheet.Name $title $theme $rawTextLines
  $type = Get-BlockType $section $sheet.Name $theme
  $distanceMeters = Convert-Distance $distance
  $durationMinutes = Convert-DurationMinutes $duration
  $themeValue = if ($theme) { $theme } elseif ($title) { $title } else { "Algemeen" }
  $titleValue = if ($title) { $title } else { $themeValue }
  $lines = @($rawLines | ForEach-Object { Format-SetLine $_ $type $themeValue $slagfocus } | Where-Object { $_ })
  if ($lines.Count -eq 0) { return $null }

  $hashInput = (($type, $themeValue, $slagfocus) + $lines) -join "`n"
  $hash = (Get-Sha1 $hashInput).Substring(0, 12)
  $themeSlug = Get-Slug $themeValue
  $strokeSlug = Get-StrokeFolder $slagfocus
  $category = Get-Category $type $themeValue $titleValue $sheet.Name
  if ($themeSlug.Length -gt 36) {
    $themeSlug = $themeSlug.Substring(0, 36).Trim("-")
  }
  $id = "$strokeSlug-$category-$themeSlug-$hash"
  $tags = Get-Tags $sheet.Name $type $themeValue $slagfocus
  $rowRange = "$startRow-$endRow"
  $colRange = "$(Get-ColName $startCol)-$(Get-ColName $endCol)"

  return [pscustomobject]@{
    Id = $id
    Hash = $hash
    Sheet = $sheet.Name
    Type = $type
    Category = $category
    StrokeFolder = Get-StrokeFolder $slagfocus
    Title = $titleValue
    Theme = $themeValue
    Slagfocus = $slagfocus
    Distance = $distanceMeters
    Duration = $durationMinutes
    RowRange = $rowRange
    ColRange = $colRange
    TrainingDates = if ($trainingDate) { @($trainingDate) } else { @() }
    Tags = $tags
    Lines = $lines
  }
}

function Find-SourceBlocks($sheet) {
  $headers = @()
  for ($row = 1; $row -lt $sheet.MaxRow; $row++) {
    for ($col = 1; $col -le $sheet.MaxCol; $col++) {
      if ((Get-Cell $sheet $row $col) -eq "Tijd" -and (Get-Cell $sheet ($row + 1) $col) -eq "Afstand") {
        $startCol = Find-StartCol $sheet $row $col
        $headers += [pscustomobject]@{ Row = $row; StartCol = $startCol; MetaCol = $col }
      }
    }
  }

  $blocks = @()
  foreach ($header in $headers) {
    $sameRowStarts = @($headers | Where-Object { $_.Row -eq $header.Row } | Sort-Object StartCol)
    $nextSameRow = $sameRowStarts | Where-Object { $_.StartCol -gt $header.StartCol } | Select-Object -First 1
    $endCol = if ($nextSameRow) { $nextSameRow.StartCol - 1 } else { $sheet.MaxCol }
    $nextSameStart = $headers | Where-Object { $_.StartCol -eq $header.StartCol -and $_.Row -gt $header.Row } | Sort-Object Row | Select-Object -First 1
    $endRow = if ($nextSameStart) { $nextSameStart.Row - 1 } else { $sheet.MaxRow }
    $title = Get-Cell $sheet $header.Row $header.StartCol
    $theme = Get-Cell $sheet ($header.Row + 1) $header.StartCol
    if ($sheet.Name -eq "Inzwemmen") {
      $title = "Inzwemmen"
      $theme = "Inzwemmen"
    }
    $block = New-Block $sheet "" $header.Row $endRow $header.StartCol $endCol $header.MetaCol $title $theme (Get-Cell $sheet $header.Row ($header.MetaCol + 1)) (Get-Cell $sheet ($header.Row + 1) ($header.MetaCol + 1)) ($header.Row + 2) $null
    if ($block) { $blocks += $block }
  }
  return $blocks
}

function Find-YearBlocks($sheet) {
  $sectionValues = @("INZWEMMEN", "KERN: 1", "KERN: 2")
  $boundaryValues = @("INZWEMMEN", "KERN: 1", "KERN: 2", "BONUS: 3", "UITZWEMMEN")
  $headers = @()
  for ($row = 1; $row -le $sheet.MaxRow; $row++) {
    for ($col = 1; $col -le $sheet.MaxCol; $col++) {
      $value = Get-Cell $sheet $row $col
      if ($sectionValues -contains $value) {
        $headers += [pscustomobject]@{ Row = $row; StartCol = $col - 4; MetaCol = $col; Section = $value }
      }
    }
  }

  $boundaries = @()
  for ($row = 1; $row -le $sheet.MaxRow; $row++) {
    for ($col = 1; $col -le $sheet.MaxCol; $col++) {
      $value = Get-Cell $sheet $row $col
      if ($boundaryValues -contains $value) {
        $boundaries += [pscustomobject]@{ Row = $row; StartCol = $col - 4; MetaCol = $col; Section = $value }
      }
    }
  }

  $blocks = @()
  foreach ($header in $headers) {
    $nextBoundary = $boundaries | Where-Object { $_.StartCol -eq $header.StartCol -and $_.Row -gt $header.Row } | Sort-Object Row | Select-Object -First 1
    $endRow = if ($nextBoundary) { $nextBoundary.Row - 1 } else { [math]::Min($sheet.MaxRow, $header.Row + 20) }
    $endCol = $header.MetaCol - 1
    $trainingDate = Convert-ExcelDate (Get-Cell $sheet ($header.Row - 14) $header.StartCol)
    if (-not $trainingDate) {
      $trainingDate = Convert-ExcelDate (Get-Cell $sheet ($header.Row - 15) $header.StartCol)
    }
    $title = if ($header.Section -eq "INZWEMMEN") { "Inzwemmen" } else { Get-Cell $sheet ($header.Row + 1) $header.StartCol }
    $theme = if ($header.Section -eq "INZWEMMEN") { "Inzwemmen" } else { Get-Cell $sheet ($header.Row + 2) $header.StartCol }
    $block = New-Block $sheet $header.Section $header.Row $endRow $header.StartCol $endCol $header.MetaCol $title $theme (Get-Cell $sheet ($header.Row + 1) ($header.MetaCol + 1)) (Get-Cell $sheet ($header.Row + 2) ($header.MetaCol + 1)) ($header.Row + 3) $trainingDate
    if ($block) { $blocks += $block }
  }
  return $blocks
}

function Write-BlockMarkdown($block, [string]$root) {
  $dir = if ($block.Type -eq "inzwemmen") {
    Join-Path $root "inzwemmen"
  } else {
    Join-Path (Join-Path $root $block.StrokeFolder) $block.Category
  }
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $file = Join-Path $dir "$($block.Id).md"

  $distanceLine = if ($block.Distance) { "afstand_m: $($block.Distance)" } else { "afstand_m: 0" }
  $durationLine = if ($block.Duration) { "duur_min: $($block.Duration)" } else { "duur_min: 0" }
  $tagsYaml = ($block.Tags | ForEach-Object { "  - $_" }) -join "`n"
  $headingDistance = if ($block.Distance) { " - $($block.Distance)m" } else { "" }

  $markdown = @"
---
id: $($block.Id)
type: $($block.Type)
categorie: $($block.Category)
thema: "$($block.Theme.Replace('"', '\"'))"
slagfocus: "$($block.Slagfocus)"
$distanceLine
$durationLine
status: concept
rating:
  gemiddelde: 0
  aantal: 0
gebruik:
  aantal: $($block.TrainingDates.Count)
  trainingen:
$(
  if ($block.TrainingDates.Count -gt 0) {
    ($block.TrainingDates | ForEach-Object { "    - $_" }) -join "`n"
  } else {
    "    []"
  }
)
wijzigingen: []
tags:
$tagsYaml
---

## Blok - $($block.Theme) - $($block.Slagfocus)$headingDistance

$($block.Lines -join "`n")
"@

  Set-Content -Path $file -Value $markdown -Encoding UTF8
  return $file
}

$sheets = Read-Workbook $WorkbookPath
$allBlocks = @()
foreach ($sheet in $sheets) {
  if ($sheet.Name -in @("2025", "2026")) {
    $allBlocks += Find-YearBlocks $sheet
  } else {
    $allBlocks += Find-SourceBlocks $sheet
  }
}

$unique = @{}
$duplicates = 0
foreach ($block in $allBlocks) {
  if ($unique.ContainsKey($block.Hash)) {
    $existing = $unique[$block.Hash]
    $existing.TrainingDates = @($existing.TrainingDates + $block.TrainingDates | Where-Object { $_ } | Sort-Object -Unique)
    $duplicates++
  } else {
    $block.TrainingDates = @($block.TrainingDates | Where-Object { $_ } | Sort-Object -Unique)
    $unique[$block.Hash] = $block
  }
}

$managedFolders = @("alle-slagen", "bc", "rc", "ss", "vl", "wis", "inzwemmen")
foreach ($folder in $managedFolders) {
  $pathToRemove = Join-Path $OutputRoot $folder
  if (Test-Path $pathToRemove) {
    Remove-Item -Path $pathToRemove -Recurse -Force
  }
}
$oldExcelRoot = Join-Path $OutputRoot "excel"
if (Test-Path $oldExcelRoot) {
  Remove-Item -Path $oldExcelRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null

$files = @()
foreach ($block in ($unique.Values | Sort-Object StrokeFolder, Category, Theme, Id)) {
  $files += Write-BlockMarkdown $block $OutputRoot
}

$report = [pscustomobject]@{
  workbook = $WorkbookPath
  generated_at = (Get-Date).ToString("s")
  detected_blocks = $allBlocks.Count
  unique_blocks = $files.Count
  duplicate_blocks = $duplicates
  output_root = $OutputRoot
  sheets = @($allBlocks | Group-Object Sheet | ForEach-Object {
    [pscustomobject]@{ sheet = $_.Name; detected = $_.Count }
  })
  unique_by_type = @($unique.Values | Group-Object Type | Sort-Object Name | ForEach-Object {
    [pscustomobject]@{ type = $_.Name; count = $_.Count }
  })
  unique_by_category = @($unique.Values | Group-Object Category | Sort-Object Name | ForEach-Object {
    [pscustomobject]@{ category = $_.Name; count = $_.Count }
  })
  unique_by_stroke_and_category = @($unique.Values | Group-Object StrokeFolder, Category | Sort-Object Name | ForEach-Object {
    $parts = $_.Name -split ", "
    [pscustomobject]@{ slag = $parts[0]; category = $parts[1]; count = $_.Count }
  })
  unique_by_output_path = @($unique.Values | ForEach-Object {
    if ($_.Type -eq "inzwemmen") { "inzwemmen" } else { "$($_.StrokeFolder)/$($_.Category)" }
  } | Group-Object | Sort-Object Name | ForEach-Object {
    [pscustomobject]@{ path = $_.Name; count = $_.Count }
  })
}

$reportPath = Join-Path $OutputRoot "import-report.json"
$report | ConvertTo-Json -Depth 5 | Set-Content -Path $reportPath -Encoding UTF8
Write-Output "Gedetecteerde blokken: $($allBlocks.Count)"
Write-Output "Unieke blokken: $($files.Count)"
Write-Output "Duplicaten overgeslagen: $duplicates"
Write-Output "Rapport: $reportPath"
