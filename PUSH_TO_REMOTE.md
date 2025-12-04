How to push this repository to another GitHub remote

1) From the repository root run the helper script (PowerShell):

    .\scripts\push-to-remote.ps1

or pass custom values:

    .\scripts\push-to-remote.ps1 -RemoteName mirror -RemoteUrl 'https://github.com/zxczxcccc/obrasltda.git' -Branch main

2) The script will:
   - verify you're in a git repository
   - add (or update) the remote named 'mirror' pointing to the URL you provided
   - fetch and push the 'main' branch and set upstream

3) Manual steps if you prefer:

    git remote add mirror https://github.com/zxczxcccc/obrasltda.git
    git fetch mirror
    git push mirror main --set-upstream

Notes:
- You need Git installed and configured with credentials to push to GitHub.
- The script does not force-push or rewrite history.
