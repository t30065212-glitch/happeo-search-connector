const { parse } = require("csv-parse/sync");

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1TUQO8kXve2mBGeSntkAZMZlrhAwGWogFz33rfL2VXVU/export?format=csv&gid=1667741326";

async function fetchGoogleSheetServices() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet. Status Code: ${response.status}`);
    }
    const text = await response.text();

    const records = parse(text, {
      delimiter: ',',
      from_line: 2,
      relax_quotes: true,
      trim: true,
      skip_empty_lines: true
    });

    const services = [];
    for (const record of records) {
      // Category is Column B (index 1)
      const category = record[1] && record[1].trim() !== "" ? record[1].trim() : "General";
      // ID is Column C (index 2)
      const id = record[2] || `service-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      // Name is Column D (index 3)
      const name = record[3] && record[3].trim() !== "" ? record[3].trim() : "Unnamed Service";

      if (name && name !== "Unnamed Service") {
        services.push({
          id: id.toString().toLowerCase().replace(/\s+/g, '-'),
          name: name,
          description: record[4] || "No description available",
          features: record[5] || "",
          category: category,
          url: record[21] || "#"
        });
      }
    }
    return services;
  } catch (err) {
    throw new Error(`Failed to fetch and parse sheet: ${err.message}`);
  }
}

module.exports = { fetchGoogleSheetServices };
