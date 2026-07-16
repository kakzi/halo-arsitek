#!/bin/bash
FILES=$(find src/features/admin src/app/\(admin\) -type f -name "*.tsx")
for FILE in $FILES; do
  sed -i '' 's/#0A0A0A/#FFFFFF/g' "$FILE"
  sed -i '' 's/#F5F5F5/#111827/g' "$FILE"
  sed -i '' 's/#2C2C2E/#E5E7EB/g' "$FILE"
  sed -i '' 's/#1C1C1E/#F9FAFB/g' "$FILE"
  sed -i '' 's/color: '\''#0A0A0A'\''/color: '\''#FFFFFF'\''/g' "$FILE" # Fixing button texts if they were black, but actually the buttons have gold background.
done
