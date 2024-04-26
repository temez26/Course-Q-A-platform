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

  for (let i = 0; i < courseNames.length; i++) {
    console.log(`Checking course: ${courseNames[i]}`);

    // Click the "View Course" button for the specific course
    await page.click(`:nth-match(button:has-text("View Course"), ${i + 1})`);

    const courseTitleName = await page.textContent("h1.text-5xl");
    console.log(`Course title: ${courseTitleName}`);
    expect(courseTitleName).toBe("Welcome to the course page");

    // Fetch the course name from the course page
    const coursePageName = await page.textContent("h2.text-2xl");
    console.log(`Course page name: ${coursePageName}`);
    expect(coursePageName).toBe(courseNames[i]);

    // Navigate back to the course list page
    await page.click(`button:has-text("Back to Courses")`);

    // Add a delay to ensure the page has fully reloaded before the next iteration starts
    await page.waitForTimeout(10);
  }
});
