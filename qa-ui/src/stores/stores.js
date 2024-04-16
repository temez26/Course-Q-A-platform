import { readable, writable } from "svelte/store";

let user = localStorage.getItem("userUuid");


if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}
export let courseId = writable(0);
export const userUuid = readable(user);
