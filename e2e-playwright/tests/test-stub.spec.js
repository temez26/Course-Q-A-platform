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

  await checkTextContent(page, "h1", "Welcome to Our Courses");
  await clickButton(page, "Courses");
  await checkTextContent(page, ".text-5xl", "Select any course you want");

  for (let i = 0; i < courseNames.length; i++) {
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

test("Checking that the question page opens", async ({ page }) => {
  // Navigate to the courses page
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });

  // Check if the courses page loaded correctly
  await checkTextContent(page, "h1", "Welcome to Our Courses");

  // Click on the "Courses" button to view the courses
  await clickButton(page, "Courses");

  for (let i = 0; i < courseNames.length; i++) {
    // Define the expected question text for the current course
    const questionText = courseQuestions[i];

    // Click on the course
    await page.click(`:nth-match(button:has-text("View Course"), ${i + 1})`);

    // Check if the course page loaded correctly
    await checkTextContent(page, "h1.text-5xl", "Welcome to the course page");

    // Click on the first question to open the question page
    await page.click(`a.font-bold.text-2xl:nth-child(1)`);

    // Check if the question page loaded correctly
    await checkTextContent(
      page,
      "span.text-white.overflow-auto.break-words",
      questionText
    );

    // Check that the correct question name is displayed on the question page
    const questionName = await page.textContent(
      "span.text-white.overflow-auto.break-words"
    );

    expect(questionName).toBe(questionText);

    // Go back to the courses page
    await clickButton(page, "Back to the Course");
    await clickButton(page, "Back to Courses");
    await page.waitForTimeout(10);
  }
});

test("Checking the upvoting of the questions", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });

  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);

  // Wait for the vote count element to appear on the page
  await page.waitForSelector(
    "span.ml-2.text-white.bg-green-500.p-1.m-2.rounded"
  );

  // Get the initial vote count
  let initialVotes = await page.$eval(
    "span.ml-2.text-white.bg-green-500.p-1.m-2.rounded",
    (el) => Number(el.textContent)
  );

  // Click the "Upvote" button
  await page.click(`button:has-text("Upvote")`);

  // Wait for the vote count to update
  await page.waitForTimeout(1000);

  // Get the updated vote count
  let updatedVotes = await page.$eval(
    "span.ml-2.text-white.bg-green-500.p-1.m-2.rounded",
    (el) => Number(el.textContent)
  );

  // Check if the vote count has increased
  expect(updatedVotes).toBe(initialVotes + 1);
});

test("Checking the upvoting of the answers", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);

  const questionText = courseQuestions[0];
  // Click on the first question to open the question page
  await page.click(`a.font-bold.text-2xl:nth-child(1)`);

  // Check if the question page loaded correctly
  await checkTextContent(
    page,
    "span.text-white.overflow-auto.break-words",
    questionText
  );

  // Wait for the vote count element to appear on the page
  await page.waitForSelector(
    "div.bg-green-600.text-gray-200.p-1.rounded.m-2 p.font-bold"
  );

  // Get the initial vote count
  let initialVotes = await page.$eval(
    "div.bg-green-600.text-gray-200.p-1.rounded.m-2 p.font-bold",
    (el) => Number(el.textContent)
  );

  // Click the "Upvote" button
  await page.click(`button:has-text("Upvote")`);

  // Wait for the vote count to update
  await page.waitForTimeout(1000);

  // Get the updated vote count
  let updatedVotes = await page.$eval(
    "div.bg-green-600.text-gray-200.p-1.rounded.m-2 p.font-bold",
    (el) => Number(el.textContent)
  );

  // Check if the vote count has increased
  expect(updatedVotes).toBe(initialVotes + 1);
});

test("Checking if the llmanswers list has content", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);

  // Click on the first question to open the question page
  await page.click(`a.font-bold.text-2xl:nth-child(1)`);

  // Wait for the answers list to load
  await page.waitForSelector("ul li.mb-2.bg-gray-700.rounded.p-2");

  // Check if there is at least one answer in the list
  const answers = await page.$$eval(
    "ul li.mb-2.bg-gray-700.rounded.p-2",
    (answers) => answers.length
  );
  expect(answers).toBeGreaterThan(0);
});

test("Checking if the answer inputted goes to the answer list", async ({
  page,
}) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);

  // Click on the first question to open the question page
  await page.click(`a.font-bold.text-2xl:nth-child(1)`);

  // Wait for the answer input to load
  await page.waitForSelector(
    "input.bg-gray-700.text-white.p-2.rounded.w-full.mb-2"
  );

  // Input a unique answer
  const uniqueAnswer =
    "Unique answer " + Math.random().toString(36).substring(7);
  await page.fill(
    "input.bg-gray-700.text-white.p-2.rounded.w-full.mb-2",
    uniqueAnswer
  );

  // Click the "Submit" button
  await page.click(`button:has-text("Submit")`);

  // Wait for the answer to be added to the list
  await page.waitForTimeout(1000);

  // Check if the unique answer is in the list
  const answerInList = await page.$$eval(
    "ul li.mb-2.bg-gray-700.rounded.p-2 p.text-lg.overflow-auto.break-words.flex-grow",
    (answers, uniqueAnswer) =>
      answers.some((answer) => answer.textContent === uniqueAnswer),
    uniqueAnswer
  );
  expect(answerInList).toBe(true);
});
