To get the operating system (OS) information in a shell command, you can use the following methods depending on your shell and OS:

### For Unix/Linux/MacOS (using Bash):

```bash
# Get OS name and version
uname -a

# Alternatively, for more detailed information:
lsb_release -a  # On systems that support lsb_release
cat /etc/os-release  # On systems with systemd
```

### For Windows (using Command Prompt):

```cmd
# Get OS version
ver

# For more detailed information:
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
```

### For Windows (using PowerShell):

```powershell
# Get OS information
Get-ComputerInfo | Select-Object WindowsVersion, WindowsBuildLabEx
```

These commands will provide you with the OS information directly from the command line. Choose the command that best fits your operating system and shell environment.

