# QA screenshot helper for MCREATOPIA cinematic redesign.
# Usage: pwsh -File scripts/qa-screenshots.ps1 [-Filter home|inner|all]
param(
  [string]$Filter = 'all'
)

$ErrorActionPreference = 'Continue'
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$base = 'http://127.0.0.1:5173/MCTP-Frontend/'
$out = 'D:\code\MCTP\_review\qa'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$shots = @(
  @{ name = 'home-hero-1440'; w = 1440; h = 900; url = "$base#/"; group = 'home' },
  @{ name = 'home-about-1440'; w = 1440; h = 900; url = "${base}?scroll=1100#/"; group = 'home' },
  @{ name = 'home-features-1440'; w = 1440; h = 900; url = "${base}?scroll=2600#/"; group = 'home' },
  @{ name = 'home-story-1440'; w = 1440; h = 900; url = "${base}?scroll=4300#/"; group = 'home' },
  @{ name = 'home-contact-1440'; w = 1440; h = 900; url = "${base}?scroll=6000#/"; group = 'home' },
  @{ name = 'home-hero-390'; w = 390; h = 844; url = "$base#/"; group = 'home' },
  @{ name = 'home-about-390'; w = 390; h = 844; url = "${base}?scroll=900#/"; group = 'home' },
  @{ name = 'home-features-390'; w = 390; h = 844; url = "${base}?scroll=2400#/"; group = 'home' },
  @{ name = 'login-1440'; w = 1440; h = 1000; url = "$base#/login"; group = 'inner' },
  @{ name = 'register-1440'; w = 1440; h = 1100; url = "$base#/register"; group = 'inner' },
  @{ name = 'announcements-1440'; w = 1440; h = 1000; url = "$base#/announcements"; group = 'inner' },
  @{ name = 'forbidden-1440'; w = 1440; h = 900; url = "$base#/forbidden"; group = 'inner' },
  @{ name = 'missing-1440'; w = 1440; h = 900; url = "$base#/nope"; group = 'inner' },
  @{ name = 'login-390'; w = 390; h = 900; url = "$base#/login"; group = 'inner' },
  @{ name = 'announcements-390'; w = 390; h = 900; url = "$base#/announcements"; group = 'inner' }
)

foreach ($shot in $shots) {
  if ($Filter -ne 'all' -and $shot.group -ne $Filter) { continue }
  $args = @(
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--enable-unsafe-swiftshader', "--window-size=$($shot.w),$($shot.h)",
    "--screenshot=$out\$($shot.name).png", "--user-data-dir=$env:TEMP\edge-qa",
    '--virtual-time-budget=13000', $shot.url
  )
  Start-Process -FilePath $edge -ArgumentList $args -NoNewWindow -Wait -RedirectStandardError "$env:TEMP\edge-qa-err.txt" | Out-Null
  $file = Get-Item "$out\$($shot.name).png" -ErrorAction SilentlyContinue
  if ($file) {
    Write-Output ("{0}  {1} KB" -f $shot.name, [math]::Round($file.Length / 1024))
  } else {
    Write-Output ("{0}  FAILED" -f $shot.name)
  }
}

Write-Output "Output: $out"
