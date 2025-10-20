#!/bin/bash
# 🔄 Script to sync your fork with Zahra's original repo

echo "Fetching latest updates from Zahra-Rahimii/admin-dashboard ..."
git fetch upstream

echo "Switching to main branch ..."
git checkout main

echo "Merging updates from upstream/main ..."
git merge upstream/main

echo "Pushing merged changes to your fork ..."
git push origin main

echo "✅ Done! Your fork is now synced with the original project."
