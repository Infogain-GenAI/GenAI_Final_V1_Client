# Download and install ZAP
Invoke-WebRequest -Uri "https://github.com/zaproxy/zaproxy/releases/download/v2.15.0/ZAP_2_15_0_windows.exe" -OutFile "ZAP_2_15_0_windows.exe"
Start-Process -FilePath "ZAP_2_15_0_windows.exe" -ArgumentList "/S" -Wait

# Start ZAP in daemon mode
#Start-Process -FilePath "C:\Program Files\ZAP\Zed Attack Proxy\zap.bat" -ArgumentList "-daemon -port 8080" -NoNewWindow -Wait

# Wait for ZAP to start
#Start-Sleep -Seconds 30

# Run ZAP scan
#Invoke-WebRequest -Uri "http://localhost:8080/JSON/ascan/action/scan/?url=https://infogaingaiappformultipersona.azurewebsites.net" -Method GET

# Wait for the scan to complete
#Start-Sleep -Seconds 300

# Generate report
#Invoke-WebRequest -Uri "http://localhost:8080/OTHER/core/other/htmlreport/" -OutFile "zap_report.html"