//const cheerio = require("cheerio");

import * as cheerio from "cheerio";

async function printSecretMessage(url) {
  try {
    console.log("starting process...");

    //const cheerio = await import("cheerio");
    let fetchUrl = url;

    // regex for matching normal doc or published doc
    const normalDocMatch = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);

    const publishedDocMatch = url.match(
      /\/document\/d\/e\/([a-zA-Z0-9-_]+)\/pub/,
    );

    if (publishedDocMatch) {
      fetchUrl = `https://docs.google.com/document/d/e/${publishedDocMatch[1]}/pub?embedded=true`;
    } else if (normalDocMatch) {
      fetchUrl = `https://docs.google.com/document/d/${normalDocMatch[1]}/export?format=html`;
    } else if (!url.includes("format=html")) {
      fetchUrl = url + (url.includes("?") ? "&" : "?") + "format=html";
    }

    console.log("fetching document from: " + fetchUrl);

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error("failed to fetch, error: " + response.status);
    }

    const html = await response.text();

    console.log("HTML preview (first 100 chars0; ", html.substring(0, 100));

    const $ = cheerio.load(html);
    console.log("numbe rof tables found are ", $("table").length);

    const table = $("table").first();

    if (!table.length) {
      throw new Error("No table found");
    }

    const dataPoints = [];
    let maxX = 0;
    let maxY = 0;

    table.find("tr").each((rowIndex, rowElement) => {
      if (rowIndex === 0) return;

      const cells = $(rowElement).find("td, th");

      if (cells.length >= 3) {
        const xStr = $(cells[0]).text().trim();
        const charStr = $(cells[1]).text().trim();
        const yStr = $(cells[2]).text().trim();

        const x = parseInt(xStr, 10);
        const y = parseInt(yStr, 10);

        if (!isNaN(x) && !isNaN(y) && charStr.length > 0) {
          dataPoints.push({ x, y, char: charStr });
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    });

    if (dataPoints.length === 0) {
      console.log("valid data points not found");
      return;
    }

    console.log(
      "Parsed " +
        dataPoints.length +
        " data points. Grid size: " +
        (maxX + 1) +
        " x " +
        (maxY + 1),
    );

    const grid = Array.from({ length: maxY + 1 }, () =>
      Array(maxX + 1).fill(" "),
    );

    dataPoints.forEach(({ x, y, char }) => {
      if (y < grid.length && x < grid[y].length) {
        grid[y][x] = char;
      }
    });

    //print secret message
    console.log("\n- Secret Message Grid -\n");
    grid.forEach((row, index) => {
      console.log(row.join(""));
    });
    console.log("Message end");
  } catch (error) {
    console.log("error processing stuff...");
  }
}

//module.exports = { printSecretMessage };

//if (require.main === module) {
//const url = process.argv[2];
//if (!url) {
//console.error("invalid google doc link");
//process.exit(1);
// }
//printSecretMessage;
//}

printSecretMessage(process.argv[2]);
