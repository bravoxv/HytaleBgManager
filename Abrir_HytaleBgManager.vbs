Set WshShell = CreateObject("WScript.Shell")
Dim appDir
appDir = WshShell.ExpandEnvironmentStrings("%LOCALAPPDATA%\HytaleBgManager")
WshShell.CurrentDirectory = appDir
WshShell.Run "HytaleBgServer.exe", 0, False
