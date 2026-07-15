#!/bin/bash
FILES=$(find src/features/admin src/app/\(admin\) -type f -name "*.tsx")
for FILE in $FILES; do
  sed -i '' 's/#141414/#FFFFFF/g' "$FILE"
  sed -i '' 's/#1C1C1E/#F9FAFB/g' "$FILE"
done
