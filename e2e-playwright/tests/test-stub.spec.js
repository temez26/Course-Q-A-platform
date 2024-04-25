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
  const welcomeText = await page.textContent("h1");
  expect(welcomeText).toBe("Welcome to Our Courses");

  // Check that the "Courses" button exists
  const button = await page.waitForSelector('button:has-text("Courses")');
  expect(button).toBeTruthy();

  // Click the "Courses" button
  await page.click('button:has-text("Courses")');

  // Check that the page has the text "Select any course you want"
  const coursesText = await page.textContent(".text-5xl");
  expect(coursesText).toBe("Select any course you want");

  // Check for the course names
  const courseNames = [
    "Computer Science",
    "Software Engineering",
    "Data Science",
    "Artificial Intelligence",
    "Machine Learning",
    "Network Security",
    "Cloud Computing",
    "Web Development",
  ];
  for (const name of courseNames) {
    const courseElement = await page.waitForSelector(`text=${name}`);
    expect(courseElement).toBeTruthy();
  }
});
