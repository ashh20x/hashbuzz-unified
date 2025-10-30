const fs = require("fs");
const path = require("path");

const contractsDir = path.join(__dirname, "build", "contracts");
const metadataDir = path.join(contractsDir, "metadata");

// Ensure the metadata directory exists
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}

// Read all JSON files from the contracts directory
fs.readdir(contractsDir, (err, files) => {
  if (err) {
    console.error("Error reading contracts directory:", err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(contractsDir, file);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}:`, err);
          return;
        }

        try {
          const jsonData = JSON.parse(data);
          if (jsonData.metadata) {
            const metadataFilePath = path.join(
              metadataDir,
              `${path.basename(file, ".json")}.json`
            );
            fs.writeFile(metadataFilePath, jsonData.metadata, "utf8", (err) => {
              if (err) {
                console.error(
                  `Error writing metadata file ${metadataFilePath}:`,
                  err
                );
              } else {
                console.log(
                  `Metadata for ${file} written to ${metadataFilePath}`
                );
              }
            });
          } else {
            console.warn(`No metadata found in ${file}`);
          }
        } catch (parseErr) {
          console.error(`Error parsing JSON from file ${file}:`, parseErr);
        }
      });
    }
  });
});
