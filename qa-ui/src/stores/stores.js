import { writable } from "svelte/store";

// Variables that use localStorage or subscribe
let user = localStorage.getItem("userUuid");
if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}
export const userUuid = writable(user);

export let courseId = writable(sessionStorage.getItem("courseId") || 0);
courseId.subscribe((value) => sessionStorage.setItem("courseId", value));

export const specificQuestionId = writable(
  sessionStorage.getItem("specificQuestionId") || 0
);
specificQuestionId.subscribe((value) =>
  sessionStorage.setItem("specificQuestionId", value)
);

export let currentPage = writable(
  parseInt(sessionStorage.getItem("currentPage")) || 0
);
currentPage.subscribe((value) =>
  sessionStorage.setItem("currentPage", value.toString())
);
export let coursepage = writable(
  parseInt(sessionStorage.getItem("coursepage")) || 0
);
coursepage.subscribe((value) =>
  sessionStorage.setItem("coursepage", value.toString())
);

export let userAnswer = writable(sessionStorage.getItem("userAnswer") || "");
userAnswer.subscribe((value) => sessionStorage.setItem("userAnswer", value));

export let question = writable(sessionStorage.getItem("question") || "");
question.subscribe((value) => sessionStorage.setItem("question", value));

export let tempId = writable(0);
export const currentCourse = writable(null);
export let questionsAndAnswers = writable([]);
export const updatedAnswers = writable([]);
