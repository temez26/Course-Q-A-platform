import { writable } from "svelte/store";

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}
export let courseId = writable(localStorage.getItem("courseId") || 0);

courseId.subscribe((value) => localStorage.setItem("courseId", value));
export const userUuid = writable(user);
export const currentCourse = writable(null);
