const { parse } = require("csv-parse/sync");
const url = "https://docs.google.com/spreadsheets/d/1TUQO8kXve2mBGeSntkAZMZlrhAwGWogFz33rfL2VXVU/export?format=csv&gid=1667741326";
fetch(url)
    .then(res => res.text())
    .then(text => {
        const records = parse(text, { relax_quotes: true, trim: true, skip_empty_lines: true });
        const headers = records[1];
        const row = records[2];
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        console.log("Column Mapping:");
        for (let i = 0; i < Math.min(headers.length, 26); i++) {
            console.log(`${alphabet[i]} (Index ${i}): Header="${headers[i]}" | RowData="${row[i] ? row[i].substring(0, 30) : ''}"`);
        }
    });
