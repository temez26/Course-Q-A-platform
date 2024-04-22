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
} from "../stores/stores.js";
// for the course page component
export const nextPage = () => {
  coursepage.update((n) => n + 1);
  fetchQuestionsAndAnswers(get(coursepage));
};

export const prevPage = () => {
  coursepage.update((n) => (n > 0 ? n - 1 : 0));
  fetchQuestionsAndAnswers(get(coursepage));
};
// for the question page component
export const nextPage1 = () => {
  currentPage.update((n) => n + 1);
  fetchQuestionsAndAnswers();
};

export const prevPage1 = () => {
  currentPage.update((n) => (n > 0 ? n - 1 : n));
  fetchQuestionsAndAnswers();
};

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

export async function processQuestionsAndAnswers(jsonData) {
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

export const fetchQuestionsAndAnswers = async () => {
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
  let updatedAnswerData = await processQuestionsAndAnswers(jsonData);
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
    console.error("Error posting upvote");
  } else {
    questionsAndAnswers.update((qna) => {
      const index = qna.findIndex((item) => item.id === questionId);
      if (index !== -1) {
        qna[index].last_activity = new Date().getTime();
      }
      return qna;
    });
    await fetchQuestionsAndAnswers();
  }
};

export async function postUserAnswer(questionId) {
  const data = {
    user_id: get(userUuid),
    answer: get(userAnswer),
    question_id: questionId,
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
    fetchQuestionsAndAnswers();
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
    await fetchQuestionsAndAnswers();
  }
}
