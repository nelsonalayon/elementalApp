param(
  [int]$BackendPort = 1337,
  [int]$FrontendPort = 3000,
  [string]$FrontendOrigin = 'http://localhost:3000',
  [string]$BackendHost = 'localhost'
)

$ErrorActionPreference = 'Stop'

function Write-Step {
  param(
    [string]$Message,
    [string]$Color = 'Cyan'
  )

  Write-Host "`n==> $Message" -ForegroundColor $Color
}

function Test-PortListening {
  param([int]$Port)

  $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  return $null -ne $listeners
}

function Invoke-HttpSafe {
  param(
    [string]$Uri,
    [string]$Method = 'GET',
    [hashtable]$Headers = @{},
    [string]$Body = '',
    [int]$TimeoutSec = 10
  )

  try {
    $requestParams = @{
      UseBasicParsing = $true
      Uri = $Uri
      Method = $Method
      Headers = $Headers
      TimeoutSec = $TimeoutSec
    }

    if ($Body -and $Method -notin @('GET', 'HEAD')) {
      $requestParams.Body = $Body
    }

    $response = Invoke-WebRequest @requestParams
    return [pscustomobject]@{
      Success = $true
      StatusCode = [int]$response.StatusCode
      Headers = $response.Headers
      Content = $response.Content
      Error = $null
    }
  }
  catch {
    $status = $null
    $responseHeaders = @{}
    $content = $null

    if ($_.Exception.Response) {
      $resp = $_.Exception.Response
      $status = [int]$resp.StatusCode
      $responseHeaders = $resp.Headers
      try {
        $stream = $resp.GetResponseStream()
        if ($stream) {
          $reader = New-Object System.IO.StreamReader($stream)
          $content = $reader.ReadToEnd()
          $reader.Close()
        }
      }
      catch {}
    }

    return [pscustomobject]@{
      Success = $false
      StatusCode = $status
      Headers = $responseHeaders
      Content = $content
      Error = $_.Exception.Message
    }
  }
}

$backendBaseUrl = "http://${BackendHost}:$BackendPort"
$apiRoot = "$backendBaseUrl/api"
$authLocal = "$apiRoot/auth/local"

$results = [ordered]@{
  BackendPortListening = $false
  FrontendPortListening = $false
  ApiReachable = $false
  CorsPreflightOk = $false
}

Write-Step "1) Verificando puertos"

$results.BackendPortListening = Test-PortListening -Port $BackendPort
$results.FrontendPortListening = Test-PortListening -Port $FrontendPort

if ($results.BackendPortListening) {
  Write-Host "✅ Backend escuchando en puerto $BackendPort" -ForegroundColor Green
}
else {
  Write-Host "❌ Backend NO está escuchando en puerto $BackendPort" -ForegroundColor Red
}

if ($results.FrontendPortListening) {
  Write-Host "✅ Frontend escuchando en puerto $FrontendPort" -ForegroundColor Green
}
else {
  Write-Host "⚠️ Frontend no está en LISTEN en puerto $FrontendPort" -ForegroundColor Yellow
}

Write-Step "2) Verificando conectividad API ($apiRoot)"

$apiResponse = Invoke-HttpSafe -Uri $apiRoot -Method 'GET'
if ($apiResponse.StatusCode -in @(200, 404)) {
  $results.ApiReachable = $true
  Write-Host "✅ API alcanzable (status $($apiResponse.StatusCode))" -ForegroundColor Green
}
else {
  Write-Host "❌ API no alcanzable. Status: $($apiResponse.StatusCode). Error: $($apiResponse.Error)" -ForegroundColor Red
}

Write-Step "3) Verificando preflight CORS en /auth/local"

$preflightHeaders = @{
  Origin = $FrontendOrigin
  'Access-Control-Request-Method' = 'POST'
  'Access-Control-Request-Headers' = 'content-type,authorization'
}

$preflight = Invoke-HttpSafe -Uri $authLocal -Method 'OPTIONS' -Headers $preflightHeaders
$allowOrigin = $preflight.Headers['Access-Control-Allow-Origin']
$allowCredentials = $preflight.Headers['Access-Control-Allow-Credentials']

if (($preflight.StatusCode -in @(200, 204)) -and ($allowOrigin -eq $FrontendOrigin -or $allowOrigin -eq '*')) {
  $results.CorsPreflightOk = $true
  Write-Host "✅ CORS preflight OK (status $($preflight.StatusCode), allow-origin: $allowOrigin)" -ForegroundColor Green
}
else {
  Write-Host "❌ CORS preflight FAIL (status $($preflight.StatusCode), allow-origin: $allowOrigin)" -ForegroundColor Red
  if ($preflight.Error) {
    Write-Host "   Error: $($preflight.Error)" -ForegroundColor DarkRed
  }
}

Write-Step "Resumen" 'White'
$results.GetEnumerator() | ForEach-Object {
  $icon = if ($_.Value) { '✅' } else { '❌' }
  $color = if ($_.Value) { 'Green' } else { 'Red' }
  Write-Host "$icon $($_.Key): $($_.Value)" -ForegroundColor $color
}

if ($results.BackendPortListening -and $results.ApiReachable -and $results.CorsPreflightOk) {
  Write-Host "`nHealthcheck completado: backend y CORS están OK." -ForegroundColor Green
  exit 0
}

Write-Host "`nHealthcheck completado con fallos. Revisa los pasos marcados en rojo." -ForegroundColor Yellow
exit 1
