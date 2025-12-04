param(
    [string]$RemoteName = 'mirror',
    [string]$RemoteUrl = 'https://github.com/zxczxcccc/obrasltda.git',
    [string]$Branch = 'main'
)

Write-Host "Preparing to push branch '$Branch' to remote '$RemoteName' -> $RemoteUrl"

# Check git availability
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is not installed or not in PATH. Install Git and re-run this script."
    exit 1
}

Push-Location -LiteralPath (Resolve-Path .. | Select-Object -First 1)
try {
    # Ensure we're inside a git repo
    $isRepo = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "This folder is not a git repository. Initialize or run from the repo root."
        exit 1
    }

    # Add remote if it doesn't exist
    $remotes = git remote
    if ($remotes -notcontains $RemoteName) {
        Write-Host "Adding remote '$RemoteName' -> $RemoteUrl"
        git remote add $RemoteName $RemoteUrl
    } else {
        Write-Host "Remote '$RemoteName' already exists. Setting URL to $RemoteUrl"
        git remote set-url $RemoteName $RemoteUrl
    }

    # Fetch remote info
    git fetch $RemoteName --prune

    Write-Host "Pushing branch '$Branch' to '$RemoteName'..."
    git push $RemoteName $Branch --set-upstream

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful."
    } else {
        Write-Error "Push failed. Inspect git output above for details."
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}

Write-Host "Done."
