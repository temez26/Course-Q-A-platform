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

courseId.subscribe((value) => localStorage.setItem("courseId", value));
export const userUuid = writable(user);
export const currentCourse = writable(null);
