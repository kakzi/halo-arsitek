#!/bin/bash

# Define the files to process
FILES=$(find src/features/admin src/app/\(admin\) -type f -name "*.tsx")

for FILE in $FILES; do
  echo "Processing $FILE..."

  # Backgrounds
  sed -i '' 's/bg-neutral-950/bg-gray-50/g' "$FILE"
  sed -i '' 's/bg-neutral-900/bg-white/g' "$FILE"
  sed -i '' 's/bg-neutral-800\/50/bg-gray-50/g' "$FILE"
  sed -i '' 's/bg-neutral-800/bg-gray-100/g' "$FILE"
  
  # Text Colors
  sed -i '' 's/text-white/text-gray-900/g' "$FILE"
  sed -i '' 's/text-neutral-200/text-gray-700/g' "$FILE"
  sed -i '' 's/text-neutral-300/text-gray-600/g' "$FILE"
  sed -i '' 's/text-neutral-400/text-gray-500/g' "$FILE"
  sed -i '' 's/text-neutral-500/text-gray-400/g' "$FILE"
  
  # Borders
  sed -i '' 's/border-neutral-800/border-gray-200/g' "$FILE"
  sed -i '' 's/border-neutral-700/border-gray-300/g' "$FILE"
  sed -i '' 's/divide-neutral-800/divide-gray-200/g' "$FILE"
  
  # Rings & Focus
  sed -i '' 's/ring-neutral-800/ring-gray-200/g' "$FILE"
  sed -i '' 's/focus:ring-neutral-700/focus:ring-gray-300/g' "$FILE"
  sed -i '' 's/focus:border-neutral-700/focus:border-gray-300/g' "$FILE"
  
  # Placeholders
  sed -i '' 's/placeholder-neutral-500/placeholder-gray-400/g' "$FILE"

  # Badges / Accents (Keep Gold mostly, but maybe adjust badges if any)
  
done

echo "Done converting to light mode!"
