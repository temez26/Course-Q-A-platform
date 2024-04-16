import { readable, writable } from "svelte/store";

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}
export const courseId = writable(null);
export const userUuid = readable(user);
