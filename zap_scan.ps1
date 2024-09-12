$zapInstallDir = "C:\Program Files\ZAP\Zed Attack Proxy"
$zapExecutable = "$zapInstallDir\zap.bat"
$zapDownloadUrl = "https://github.com/zaproxy/zaproxy/releases/download/v2.15.0/ZAP_2_15_0_windows.exe"
$zapInstallerPath = "ZAP_2_15_0_windows.exe"

# Download ZAP
Write-Output "Downloading ZAP from $zapDownloadUrl..."
Invoke-WebRequest -Uri $zapDownloadUrl -OutFile $zapInstallerPath

# Install ZAP
Write-Output "Installing ZAP..."
Start-Process -FilePath "ZAP_2_15_0_windows.exe" -ArgumentList "/S" -Wait

# Verify ZAP installation
if (-Not (Test-Path $zapExecutable)) {
    Write-Error "ZAP installation failed or the executable path is incorrect. Expected at $zapExecutable"
    exit 1
}

# Start ZAP in daemon mode
Write-Output "Starting ZAP in daemon mode..."
Start-Process -FilePath $zapExecutable -ArgumentList "-daemon -port 8080" -NoNewWindow -Wait

# Wait for ZAP to start
Write-Output "Waiting for ZAP to start..."
Start-Sleep -Seconds 30

# Check if ZAP is running
$response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -ErrorAction SilentlyContinue
if ($response.StatusCode -ne 200) {
    Write-Error "ZAP did not start successfully. Status code: $($response.StatusCode)"
    exit 1
}

# Run ZAP scan
$targetUrl = "https://infogaingaiappformultipersona.azurewebsites.net"
Write-Output "Running ZAP scan on $targetUrl..."
$response = Invoke-WebRequest -Uri "http://localhost:8080/JSON/ascan/action/scan/?url=$targetUrl" -Method GET

if ($response.StatusCode -ne 200) {
    Write-Error "ZAP scan failed with status code $($response.StatusCode)"
    exit 1
}

# Wait for the scan to complete
Write-Output "Waiting for the scan to complete..."
Start-Sleep -Seconds 300

# Generate report
$reportPath = "zap_report.html"
Write-Output "Generating ZAP report..."
Invoke-WebRequest -Uri "http://localhost:8080/OTHER/core/other/htmlreport/" -OutFile $reportPath

Write-Output "ZAP scan and report generation completed. Report saved to $reportPath."