const { test, expect } = require("@playwright/test");

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

const courseQuestions = [
  "What is the prerequisite for Computer Science?",
  "What is the prerequisite for Software Engineering?",
  "What is the prerequisite for Data Science?",
  "What is the prerequisite for Artificial Intelligence?",
  "What is the prerequisite for Machine Learning?",
  "What is the prerequisite for Network Security?",
  "What is the prerequisite for Cloud Computing?",
  "What is the prerequisite for Web Development?",
];

const checkTextContent = async (page, selector, expectedText) => {
  const actualText = await page.textContent(selector);
  expect(actualText).toBe(expectedText);
};

const clickButton = async (page, buttonText) => {
  await page.click(`button:has-text("${buttonText}")`);
};

test("WebSocket connection and check all the courses exist", async ({
  page,
}) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });

  page.on(
    "console",
    (msg) =>
      msg.type() === "log" && console.log(`Browser console log: ${msg.text()}`)
  );

  await checkTextContent(page, "h1", "Welcome to Our Courses");
  await clickButton(page, "Courses");
  await checkTextContent(page, ".text-5xl", "Select any course you want");

  for (let i = 0; i < courseNames.length; i++) {
    console.log(`Checking course: ${courseNames[i]}`);
    await page.click(`:nth-match(button:has-text("View Course"), ${i + 1})`);
    await checkTextContent(page, "h1.text-5xl", "Welcome to the course page");
    await checkTextContent(page, "h2.text-2xl", courseNames[i]);
    await clickButton(page, "Back to Courses");
    await page.waitForTimeout(10);
  }
});

test("Adding question to a course", async ({ page }) => {
  // Navigate to the courses page
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });

  // Check if the courses page loaded correctly
  await checkTextContent(page, "h1", "Welcome to Our Courses");

  // Click on the "Courses" button to view the courses
  await clickButton(page, "Courses");

  for (let i = 0; i < courseNames.length; i++) {
    // Click on the course
    await page.click(`:nth-match(button:has-text("View Course"), ${i + 1})`);

    // Check if the course page loaded correctly
    await checkTextContent(page, "h1.text-5xl", "Welcome to the course page");

    // Type the question into the input field
    const questionText = courseQuestions[i];
    await page.fill(
      'input[placeholder="Enter your question here"]',
      questionText
    );

    // Click the "Ask!" button to submit the question
    await clickButton(page, "Ask!");

    // Wait for the question to be posted and the page to update
    await page.waitForTimeout(20);

    // Check if the question appears in the question list
    const questionInList = await page.textContent(`text=${questionText}`);
    expect(questionInList).toBe(questionText);

    // Go back to the courses page
    await clickButton(page, "Back to Courses");
    await page.waitForTimeout(10);
  }
});
