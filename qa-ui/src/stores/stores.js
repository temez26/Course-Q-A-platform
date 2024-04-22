import { writable } from "svelte/store";

function createSyncedStore(key, startValue) {
  const valueFromStorage = sessionStorage.getItem(key);
  const initialValue = valueFromStorage
    ? JSON.parse(valueFromStorage)
    : startValue;
  const store = writable(initialValue);
  store.subscribe((value) =>
    sessionStorage.setItem(key, JSON.stringify(value))
  );
  return store;
}

let user = localStorage.getItem("userUuid");
if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}
export const userUuid = writable(user);

export let courseId = createSyncedStore("courseId", 0);
export const specificQuestionId = createSyncedStore("specificQuestionId", 0);
export let currentPage = createSyncedStore("currentPage", 0);
export let coursepage = createSyncedStore("coursepage", 0);
export let userAnswer = createSyncedStore("userAnswer", "");
export let question = createSyncedStore("question", "");

export let tempId = writable(0);
export const currentCourse = writable(null);
export let questionsAndAnswers = writable([]);
export const updatedAnswers = writable([]);
export let course = writable(null);
export let questionId = writable(0);

export const courses = writable([]);
