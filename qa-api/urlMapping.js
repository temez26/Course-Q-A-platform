import { Router } from "./deps.js";
import { getCourses, postQuestion, postAnswer, postUpvote, getQuestions, getAnswers, generateAnswer } from "./endpoints.js";

const router = new Router();

router
  .get('/api/courses', getCourses)
  .post('/api/questions', postQuestion)
  .post('/api/answers', postAnswer)
  .post('/api/upvotes', postUpvote)
  .get('/api/questions', getQuestions)
  .get('/api/answers', getAnswers)
  .post('/api/generate-answer', generateAnswer);

export default router;