import { writable } from "svelte/store";

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}

export let courseId = writable(localStorage.getItem("courseId") || 0);
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

courseId.subscribe((value) => localStorage.setItem("courseId", value));
export const userUuid = writable(user);
export const currentCourse = writable(null);

export let questions = writable("");
export let tempId = writable(0);

export let currentPage = writable(
  parseInt(localStorage.getItem("currentPage")) || 0
);
currentPage.subscribe((value) =>
  localStorage.setItem("currentPage", value.toString())
);

export let userAnswer = writable(localStorage.getItem("userAnswer") || "");
userAnswer.subscribe((value) => localStorage.setItem("userAnswer", value));
