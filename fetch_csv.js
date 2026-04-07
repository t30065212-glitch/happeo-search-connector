const { parse } = require("csv-parse/sync");

const url = "https://docs.google.com/spreadsheets/d/1TUQO8kXve2mBGeSntkAZMZlrhAwGWogFz33rfL2VXVU/export?format=csv&gid=1667741326";
fetch(url)
    .then(res => res.text())
    .then(text => {
        const records = parse(text, { relax_quotes: true, trim: true, skip_empty_lines: true });
        // Line 0 is group headers
        // Line 1 is column headers
        console.log("Headers:", JSON.stringify(records[1]));
        console.log("Row 1 data:", JSON.stringify(records[2]));
        console.log("Row 2 data:", JSON.stringify(records[3]));
    });
