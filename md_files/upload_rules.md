# 🚀 UPLOAD & DEPLOYMENT RULES

## Workflow Overview
1. **Local Development**: All code changes are first made and tested in the local environment.
2. **Git Versioning**: Changes are committed and pushed to GitHub for version control and backup.
   - **Repo**: `git@github.com:oceandeveloper92-glitch/hir.git`
3. **Live Deployment**: Verified code is pushed/deployed to the production server.
   - **Server URL**: `https://hir.designclub.asia/`
   - **Server Path**: `public_html/hir.designclub.asia`
   - **Method**: SSH / Git Pull on server.

## Deployment Security
- **SSH Access**: A dedicated SSH key has been generated for this project.
- **Key Location**: `.ssh/id_rsa` (Private) and `.ssh/id_rsa.pub` (Public).
- **Server Setup**: The public key must be added to the server's `~/.ssh/authorized_keys` file.

### Public SSH Key (id_rsa.pub)
```text
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDi3xu2LEO2HIxVYifze3uCIp4qv2gQ98k1LofVgW8boLwRvjsPehnu8GI7YuewzQJ0fE0ggy4v+cRUGqraScqGc/gaenSwpNXZdNT4YKfEIEt8aJNdi9nO+x2S7OdZHGMr7xCB+T5nOgZLVBJANA5JaZetRxlSDbPn5FJUyej5XCc7Oykoa4xsFaLMP0PyDaIyQUNNOSnXr7CSIwegRe008T7JBsL7SlaI7UXXvvz2m2avFDSsrJg1+cY2lcRg7vnjg61GiHq2KzozJ1bqlOETTdDAhohNYPaUSMRtjxGm0SfG6mcRRUMLQCIG2XV2nLPJKSZv93wzjKhu8fRzk/hJ/f2olS/ad9dPmvnA8qJfsLhGQXnssYJzYN4oz15s0atQEIR95nMInL4zF1oBfjWR9gxHNwylSdqCZRglcVQ5kmuoJZ5gkdyQsxepPmNfXBP9B8nKhjvMa1HsO5Krpx9pidQzv7RSRk25GZUHQdGOSwpW6oCri4qYxFtcMu1mX2CZU26q0WisSP4kUBr15x2yFoOa6ct4NauEgFV1YNCBVEdFSDaXe8mPneSfWZ7/tjEjBM8plfjkCQ0iunHn1kx2YRcvQ0EEZPIn/cyG9rxIPg7Nx9FVs1grXkRrCyiNG9Jh0ScBdZV07XPdY62IOLaVCz8ac3HsdnS6izaOividRQ== ocean@DESKTOP-99Q36RF
```

## Rules for AI
- Always commit changes to Git before deploying to the server.
- Ensure the live server environment matches the local structure.
- Never delete files on the live server without a verified backup on Git.
