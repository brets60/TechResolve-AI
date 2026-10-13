$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
Set-Location "frontend\android"
.\gradlew.bat assembleDebug
Set-Location "..\.."
Copy-Item 'frontend/android/app/build/outputs/apk/debug/app-debug.apk' -Destination 'TechResolve-AI.apk' -Force
Copy-Item 'frontend/android/app/build/outputs/apk/debug/app-debug.apk' -Destination 'backend/TechResolve-AI.apk' -Force
Get-Item 'TechResolve-AI.apk' | Select-Object Name, Length, LastWriteTime
