const fs = require("fs");

const sourceFile = "public/final_properties_v1_2.json";
const outputFile = "public/properties_v1_3.json";

function cleanData(data) {
  return data.map((d, idx) => {
    const first = d.propertyLocation.slice(0, 4);
    const middle = d.propertyLocation.slice(4, -4);
    const last = d.propertyLocation.slice(-4);

    const prettyLocation = [
      first.replace(/^0+/, ""),
      middle.trim().replace(/^0+/, ""),
      last.replace(/^0+/, ""),
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    return {
      ...d,
      prettyLocation,
      id: idx,
    };
  });
}

fs.readFile(sourceFile, "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }

  try {
    const data = JSON.parse(jsonString);
    const cleanedData = cleanData(data);

    fs.writeFile(outputFile, JSON.stringify(cleanedData, null, 2), (err) => {
      if (err) {
        console.log("Error writing to file:", err);
      } else {
        console.log(`JSON has been updated and saved to ${outputFile}`);
      }
    });
  } catch (error) {
    console.log("Error parsing JSON:", error);
  }
});
