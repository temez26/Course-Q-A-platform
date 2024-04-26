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

const randomQuestions = new Map();
const checkTextContent = async (page, selector, expectedText) => {
  const actualText = await page.textContent(selector);
  expect(actualText).toBe(expectedText);
};

const clickButton = async (page, buttonText) => {
  await page.click(`button:has-text("${buttonText}")`);
};

test("1 WebSocket connection and check all the courses exist", async ({
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

test("2 Adding question to a course", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await checkTextContent(page, "h1", "Welcome to Our Courses");
  await clickButton(page, "Courses");

  for (let i = 0; i < courseNames.length; i++) {
    await page.click(`:nth-match(button:has-text("View Course"), ${i + 1})`);
    await checkTextContent(page, "h1.text-5xl", "Welcome to the course page");

    const questionText =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    console.log(
      `Course ${i + 1}: ${courseNames[i]}, Question: ${questionText}`
    );
    randomQuestions.set(i, questionText);

    await page.fill(
      'input[placeholder="Enter your question here"]',
      questionText
    );
    await clickButton(page, "Ask!");
    await page.waitForTimeout(20);

    const questionInList = await page.textContent(`text=${questionText}`);
    expect(questionInList).toBe(questionText);

    await clickButton(page, "Back to Courses");
    await page.waitForTimeout(10);
  }
});
test("3 Checking that the question page opens", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await checkTextContent(page, "h1", "Welcome to Our Courses");
  await clickButton(page, "Courses");

  for (let i = 0; i < courseNames.length; i++) {
    const questionText = randomQuestions.get(i);
    console.log(
      `Course ${i + 1}: ${courseNames[i]}, Question: ${questionText}`
    );
    await page.click(`:nth-match(button:has-text("View Course"), ${i + 1})`);
    await checkTextContent(page, "h1.text-5xl", "Welcome to the course page");
    await page.click(`a.font-bold.text-2xl:nth-child(1)`);
    await checkTextContent(
      page,
      "span.text-white.overflow-auto.break-words",
      questionText
    );
    const questionName = await page.textContent(
      "span.text-white.overflow-auto.break-words"
    );
    expect(questionName).toBe(questionText);
    await clickButton(page, "Back to the Course");
    await clickButton(page, "Back to Courses");
    await page.waitForTimeout(10);
  }
});

test("4 Checking the upvoting of the questions", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);
  await page.waitForSelector(
    "span.ml-2.text-white.bg-green-500.p-1.m-2.rounded"
  );

  let initialVotes = await page.$eval(
    "span.ml-2.text-white.bg-green-500.p-1.m-2.rounded",
    (el) => Number(el.textContent)
  );

  await page.click(`button:has-text("Upvote")`);
  await page.waitForTimeout(1000);

  let updatedVotes = await page.$eval(
    "span.ml-2.text-white.bg-green-500.p-1.m-2.rounded",
    (el) => Number(el.textContent)
  );

  expect(updatedVotes).toBe(initialVotes + 1);
});

test("5 Checking the upvoting of the answers", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);
  const questionText = randomQuestions.get(0);
  await page.click(`a.font-bold.text-2xl:nth-child(1)`);
  await checkTextContent(
    page,
    "span.text-white.overflow-auto.break-words",
    questionText
  );
  await page.waitForSelector(
    "div.bg-green-600.text-gray-200.p-1.rounded.m-2 p.font-bold"
  );

  let initialVotes = await page.$eval(
    "div.bg-green-600.text-gray-200.p-1.rounded.m-2 p.font-bold",
    (el) => Number(el.textContent)
  );

  await page.click(`button:has-text("Upvote")`);
  await page.waitForTimeout(1000);

  let updatedVotes = await page.$eval(
    "div.bg-green-600.text-gray-200.p-1.rounded.m-2 p.font-bold",
    (el) => Number(el.textContent)
  );

  expect(updatedVotes).toBe(initialVotes + 1);
});

test("6 Checking if the llmanswers list has content", async ({ page }) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);
  await page.click(`a.font-bold.text-2xl:nth-child(1)`);
  await page.waitForSelector("ul li.mb-2.bg-gray-700.rounded.p-2");

  const answers = await page.$$eval(
    "ul li.mb-2.bg-gray-700.rounded.p-2",
    (answers) => answers.length
  );
  expect(answers).toBeGreaterThan(0);
});
test("7 Checking if the answer inputted goes to the answer list", async ({
  page,
}) => {
  await page.goto("http://localhost:7800/", { waitUntil: "networkidle" });
  await clickButton(page, "Courses");
  await page.click(`:nth-match(button:has-text("View Course"), 1)`);
  await page.click(`a.font-bold.text-2xl:nth-child(1)`);
  await page.waitForSelector(
    "input.bg-gray-700.text-white.p-2.rounded.w-full.mb-2"
  );

  const uniqueAnswer =
    "Unique answer " + Math.random().toString(36).substring(7);
  await page.fill(
    "input.bg-gray-700.text-white.p-2.rounded.w-full.mb-2",
    uniqueAnswer
  );
  await page.click(`button:has-text("Submit")`);
  await page.waitForTimeout(1000);

  const answerInList = await page.$$eval(
    "ul li.mb-2.bg-gray-700.rounded.p-2 p.text-lg.overflow-auto.break-words.flex-grow",
    (answers, uniqueAnswer) =>
      answers.some((answer) => answer.textContent === uniqueAnswer),
    uniqueAnswer
  );
  expect(answerInList).toBe(true);
});
