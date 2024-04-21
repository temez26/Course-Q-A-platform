import { writable } from "svelte/store";

// Variables that use localStorage or subscribe
let user = localStorage.getItem("userUuid");
if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}
export const userUuid = writable(user);

export let courseId = writable(localStorage.getItem("courseId") || 0);
courseId.subscribe((value) => localStorage.setItem("courseId", value));

export const specificQuestionId = writable(
  localStorage.getItem("specificQuestionId") || 0
);
specificQuestionId.subscribe((value) =>
  localStorage.setItem("specificQuestionId", value)
);

export let sortBy = writable(localStorage.getItem("sortBy") || "mostUpvotes");

export let filterOn = writable(
  localStorage.getItem("filterOn") === "true" ? true : false
);

export let currentPage = writable(
  parseInt(localStorage.getItem("currentPage")) || 0
);
currentPage.subscribe((value) =>
  localStorage.setItem("currentPage", value.toString())
);

export let userAnswer = writable(localStorage.getItem("userAnswer") || "");
userAnswer.subscribe((value) => localStorage.setItem("userAnswer", value));

// Initialize questions with localStorage and subscribe to changes
export let question = writable(localStorage.getItem("question") || "");
question.subscribe((value) => localStorage.setItem("question", value));

export let tempId = writable(0);
export const currentCourse = writable(null);
