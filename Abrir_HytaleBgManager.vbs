Set WshShell = CreateObject("WScript.Shell")
Dim appDir
appDir = WshShell.ExpandEnvironmentStrings("%LOCALAPPDATA%\HytaleBgManager")
WshShell.CurrentDirectory = appDir
WshShell.Run "node server.js", 0, False
