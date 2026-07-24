import fs from "node:fs";

const file = ".output/server/wrangler.json";

if (!fs.existsSync(file)) {
  console.error("❌ wrangler.json not found.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(file, "utf8"));

// Use a known-good compatibility date.
config.compatibility_date = "2025-07-24";

fs.writeFileSync(file, JSON.stringify(config, null, 2));

console.log("✅ Updated compatibility_date to 2025-07-24");