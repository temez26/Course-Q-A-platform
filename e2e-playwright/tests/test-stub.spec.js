const { test, expect } = require("@playwright/test");

test("WebSocket connection", async ({ page }) => {
  // Navigate to your page that uses the WebSocket connection
  await page.goto("http://localhost:7800/", {
    waitUntil: "networkidle",
  });

  // Listen for console log events
  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`Browser console log: ${msg.text()}`);
    }
  });

  // Check that the page has the text "Welcome to Our Courses"
  const text = await page.textContent("h1");
  expect(text).toBe("Welcome to Our Courses");

  // Add your assertions here based on the expected console log messages
});
