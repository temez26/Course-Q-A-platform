import { get } from "svelte/store";
import {
  userUuid,
  courseId,
  question,
  coursepage,
  questionsAndAnswers,
  currentPage,
  updatedAnswers,
  specificQuestionId,
  userAnswer,
  questionId,
  course,
} from "../stores/stores.js";

// FOR THE COURSE PAGE COMPONENT
export const askSomething = async () => {
  const data = {
    user_id: get(userUuid),
    question: get(question),
    course_id: get(courseId),
  };

  const response = await fetch("/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  question.set("");

  if (get(coursepage) === 0) {
    questionsAndAnswers.update((qna) => [
      {
        id: responseData.questionId,
        question: data.question,
        votes: responseData.votes || 0,
      },
      ...qna,
    ]);
  }
};

export const fetchQuestions = async () => {
  const response = await fetch(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&page=${get(
      coursepage
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const jsonData = await response.json();

  questionsAndAnswers.set(
    jsonData
      .map((qna) => {
        return {
          ...qna,
          answers: qna.answers,
          votes: qna.votes,
          last_activity: new Date(qna.last_activity).getTime(),
        };
      })
      .sort((a, b) => b.last_activity - a.last_activity)
  );
};
// FOR THE QUESTION ANSWER COMPONENT
async function processAnswers(jsonData) {
  jsonData.sort((a, b) => {
    const aLastActivity = new Date(
      a.answers[0]?.last_activity || a.last_activity
    );
    const bLastActivity = new Date(
      b.answers[0]?.last_activity || b.last_activity
    );
    return bLastActivity - aLastActivity;
  });

  let updatedQuestionsAndAnswers = await Promise.all(
    jsonData.map(async (qna) => {
      const llmAnswers = [];
      const humanAnswers = [];
      for (let answer of qna.answers) {
        console.log("User ID:", answer.user_id);
        if (answer.user_id === null) {
          llmAnswers.push(answer);
        } else {
          humanAnswers.push(answer);
        }
      }
      console.log("LLM Answers:", llmAnswers);
      console.log("Human Answers:", humanAnswers);
      return { ...qna, llmAnswers, humanAnswers: humanAnswers.slice(0, 20) };
    })
  );

  return updatedQuestionsAndAnswers;
}
export const fetchAnswers = async () => {
  const response = await fetch(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&questionId=${get(
      specificQuestionId
    )}&page=${get(currentPage)}`,

    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const jsonData = await response.json();
  let updatedAnswerData = await processAnswers(jsonData);
  updatedAnswers.set(updatedAnswerData);
};

export const postUpvoteQuestion = async (questionId) => {
  const response = await fetch("/api/postUpvoteQuestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: get(userUuid), question_id: questionId }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error(message);
    return;
  }
  fetchAnswers();
  fetchQuestions();
};

export async function postUserAnswer() {
  const data = {
    user_id: get(userUuid),
    answer: get(userAnswer),
    question_id: get(questionId),
  };
  const response = await fetch("/api/postUserAnswer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error("Error posting user answer");
  } else {
    const qnaList = get(questionsAndAnswers);
    for (let qna of qnaList) {
      if (qna.id === questionId) {
        qna.last_activity = new Date();

        qna.answers.sort((a, b) => {
          const aLastActivity = new Date(a.last_activity);
          const bLastActivity = new Date(b.last_activity);
          return bLastActivity - aLastActivity;
        });
      }
    }
    fetchAnswers();
  }
}
export async function postUpvoteAnswer(answerId) {
  const response = await fetch("/api/postUpvote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: get(userUuid), answer_id: answerId }),
  });
  const jsonData = await response.json();
  console.log(jsonData.votes);
  if (!response.ok) {
    console.error("Error posting upvote");
  } else {
    const qnaList = get(questionsAndAnswers);
    for (let qna of qnaList) {
      for (let answer of qna.answers) {
        if (answer.id === answerId) {
          answer.last_activity = new Date();
        }
      }
    }
    fetchAnswers();
  }
}
export async function fetchCourse() {
  const response = await fetch(`/api/getCourse?courseId=${get(courseId)}`, {
    method: "GET",
  });
  if (response.ok) {
    let result = await response.json();
    course.set(result[0]);
  } else {
    throw new Error("Error fetching course");
  }
}

// FOR THE COURSES COMPONENT

export async function fetchCourses() {
  const response = await fetch("/api/getCourses");
  if (response.ok) {
    const courses = await response.json();
    console.log(courses);
    return courses;
  } else {
    throw new Error("Error fetching courses");
  }
}

export function selectCourse(id, courseIdStore) {
  courseIdStore.set(id);
  window.location.href = `/course`;
}
