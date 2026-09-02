#!/usr/bin/env node
/**
 * Playwright Video Recorder
 *
 * Records browser video by navigating through a series of steps.
 * Steps are defined in a JSON file with actions: navigate, click, fill, wait, screenshot.
 *
 * Usage:
 *   node record-video.js <steps-file.json> [options]
 *
 * Options:
 *   --output <dir>       Output directory (default: demo-biz398)
 *   --width <px>         Viewport width (default: 1440)
 *   --height <px>        Viewport height (default: 900)
 *   --storage-state <f>  Playwright auth state file
 *   --headless           Run headless (default: headed)
 *   --slow <ms>          Slow down actions by ms (default: 500)
 *
 * Steps file format (JSON array):
 * [
 *   { "action": "navigate", "url": "http://localhost:3000/stages" },
 *   { "action": "wait", "ms": 2000 },
 *   { "action": "click", "selector": "button:has-text('Nhắc lại')" },
 *   { "action": "wait", "ms": 1000 },
 *   { "action": "screenshot", "filename": "step1.png" },
 *   { "action": "fill", "selector": "input[name=timeout]", "value": "30" },
 *   { "action": "select", "selector": "select#stage", "value": "new" },
 *   { "action": "hover", "selector": ".card" },
 *   { "action": "scroll", "selector": ".container", "y": 300 },
 *   { "action": "press", "key": "Enter" }
 * ]
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    stepsFile: null,
    output: "demo-biz398",
    width: 1440,
    height: 900,
    storageState: null,
    headless: false,
    slow: 500,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--output":
        opts.output = args[++i];
        break;
      case "--width":
        opts.width = parseInt(args[++i]);
        break;
      case "--height":
        opts.height = parseInt(args[++i]);
        break;
      case "--storage-state":
        opts.storageState = args[++i];
        break;
      case "--headless":
        opts.headless = true;
        break;
      case "--slow":
        opts.slow = parseInt(args[++i]);
        break;
      default:
        if (!args[i].startsWith("--")) {
          opts.stepsFile = args[i];
        }
    }
  }

  if (!opts.stepsFile) {
    console.error("Usage: node record-video.js <steps-file.json> [options]");
    process.exit(1);
  }

  return opts;
}

async function executeStep(page, step, opts) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  switch (step.action) {
    case "navigate":
      console.log(`  -> Navigate: ${step.url}`);
      await page.goto(step.url, { waitUntil: "networkidle" });
      await delay(opts.slow);
      break;

    case "click":
      console.log(`  -> Click: ${step.selector}`);
      await page.locator(step.selector).click();
      await delay(opts.slow);
      break;

    case "fill":
      console.log(`  -> Fill: ${step.selector} = "${step.value}"`);
      await page.locator(step.selector).fill(step.value);
      await delay(opts.slow);
      break;

    case "select":
      console.log(`  -> Select: ${step.selector} = "${step.value}"`);
      await page.locator(step.selector).selectOption(step.value);
      await delay(opts.slow);
      break;

    case "hover":
      console.log(`  -> Hover: ${step.selector}`);
      await page.locator(step.selector).hover();
      await delay(opts.slow);
      break;

    case "scroll":
      console.log(`  -> Scroll: ${step.selector || "page"} y=${step.y || 0}`);
      if (step.selector) {
        await page.locator(step.selector).evaluate((el, y) => {
          el.scrollBy(0, y);
        }, step.y || 300);
      } else {
        await page.evaluate((y) => window.scrollBy(0, y), step.y || 300);
      }
      await delay(opts.slow);
      break;

    case "press":
      console.log(`  -> Press: ${step.key}`);
      await page.keyboard.press(step.key);
      await delay(opts.slow);
      break;

    case "wait":
      console.log(`  -> Wait: ${step.ms}ms`);
      await delay(step.ms);
      break;

    case "screenshot":
      const ssPath = path.join(opts.output, step.filename);
      console.log(`  -> Screenshot: ${ssPath}`);
      await page.screenshot({ path: ssPath });
      break;

    default:
      console.warn(`  !! Unknown action: ${step.action}`);
  }
}

async function main() {
  const opts = await parseArgs();

  // Read steps
  const stepsRaw = fs.readFileSync(opts.stepsFile, "utf-8");
  const steps = JSON.parse(stepsRaw);

  // Ensure output dir
  fs.mkdirSync(opts.output, { recursive: true });

  const videoDir = path.join(opts.output, "videos");
  fs.mkdirSync(videoDir, { recursive: true });

  console.log(`Recording video (${opts.width}x${opts.height})...`);
  console.log(`Output: ${opts.output}`);
  console.log(`Steps: ${steps.length}`);
  console.log(`Slow motion: ${opts.slow}ms`);
  console.log("");

  // Launch browser with video recording
  const launchOpts = {
    headless: opts.headless,
    slowMo: opts.headless ? 0 : 100,
  };

  const browser = await chromium.launch(launchOpts);

  const contextOpts = {
    viewport: { width: opts.width, height: opts.height },
    recordVideo: {
      dir: videoDir,
      size: { width: opts.width, height: opts.height },
    },
  };

  if (opts.storageState && fs.existsSync(opts.storageState)) {
    contextOpts.storageState = opts.storageState;
    console.log(`Auth: loaded from ${opts.storageState}`);
  }

  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();

  try {
    for (let i = 0; i < steps.length; i++) {
      console.log(`Step ${i + 1}/${steps.length}: ${steps[i].action}`);
      await executeStep(page, steps[i], opts);
    }

    console.log("\nFinishing recording...");
  } catch (err) {
    console.error(`\nError at step: ${JSON.stringify(steps[steps.length - 1])}`);
    console.error(err.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  // Find the recorded video
  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (videos.length > 0) {
    const videoFile = path.join(videoDir, videos[videos.length - 1]);
    const baseName = path.basename(opts.stepsFile, ".json");
    const finalPath = path.join(opts.output, `${baseName}.webm`);
    fs.renameSync(videoFile, finalPath);
    console.log(`\nVideo saved: ${finalPath}`);

    // Cleanup empty video dir
    const remaining = fs.readdirSync(videoDir);
    if (remaining.length === 0) {
      fs.rmdirSync(videoDir);
    }
  } else {
    console.log("\nWarning: No video file found. Try running headed (without --headless).");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
