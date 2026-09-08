# Build the Windows installer

## Easiest method: GitHub Actions
1. Create a GitHub repository.
2. Upload this entire folder to the repository.
3. Go to **Actions** -> **Build Windows App** -> **Run workflow**.
4. Wait for the Windows build to finish.
5. Open the completed workflow run.
6. Under **Artifacts**, download `sainik-bhojnalaya-item-control-windows`.
7. Extract it and run the `.exe` installer.

The included workflow builds the Windows x64 NSIS installer on a Windows runner.

## Local Windows method
Install Node.js 22, open PowerShell in this folder, then run:

```powershell
npm install
npm run build
```

The installer will be in `dist`.

## First launch
Open **Sainik Bhojnalaya Item Control** from the desktop shortcut.
Open Settings and enter the WooCommerce site URL, WordPress username, and an application password.

Use HTTPS. For a production rollout, use a dedicated staff account and a secure token/backend rather than a full administrator credential.
