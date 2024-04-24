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
// id for the user
export const userUuid = writable(user);
// is used to retrive the questions and answers based on the course id
export let courseId = createSyncedStore("courseId", 0);
// stores the specific question id that is clicked on the course question list
export const specificQuestionId = createSyncedStore("specificQuestionId", 0);
// stores the number of the answers list page number
export let answerpage = createSyncedStore("answerpage", 0);
// stores the number of the questions list page number
export let questionpage = createSyncedStore("questionpage", 0);
//user answer input
export let userAnswer = createSyncedStore("userAnswer", "");
//user question input
export let question = createSyncedStore("question", "");

// saves the specific course that is selected from courses page
export let course = writable(null);
// clicked id on the course question send it trough api call to get the correct question
export let questionId = writable(0);
// clicked id on the course question send it trough api call to get the correct answer
export let answerId = writable(0);
// shows the courses as a list
export const courses = writable([]);
//for the course page
export let questionsAndAnswers = writable([]);
// for the questionanswers page
export const updatedAnswers = writable([]);
