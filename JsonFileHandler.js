const fs = require("fs");
const path = require("path");

class JsonFileHandler {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading JSON file:", error);
      return null;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log("Data written successfully to JSON file.");
    } catch (error) {
      console.error("Error writing to JSON file:", error);
    }
  }

  update(newData) {
    try {
      const currentData = this.read();
      const updatedData = { ...currentData, ...newData };
      this.write(updatedData);
    } catch (error) {
      console.error("Error updating JSON file:", error);
    }
  }
}

module.exports = JsonFileHandler;

// Example usage:
// const jsonHandler = new JsonFileHandler("data.json");

// Reading data
// const data = jsonHandler.read();
// console.log("Current Data:", data);

// Writing data
// jsonHandler.write({ key: "value" });

// Updating data
// jsonHandler.update({ newKey: "newValue" });
