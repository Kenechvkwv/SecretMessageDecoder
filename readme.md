### Secret Message Decoder

A small Node.js script that reads a specially formatted Google Doc and reveals a hidden message from coordinate data inside a table.

The script fetches the document, extracts character positions, rebuilds them into a 2D grid, and prints the final message directly in the terminal.

## What It Does

The Google Doc is expected to contain a table with:

X Coordinate Character Y Coordinate

- 0 H 0
- 1 I 0

The script:

- Downloads the document HTML
- Parses the table data
- Places each character at its correct coordinate
- Prints the reconstructed message

## Requirements

- Node.js 18 or later
- npm
- npm install cheerio

# Run the script

node secret-message.js "GOOGLE_DOC_URL"
