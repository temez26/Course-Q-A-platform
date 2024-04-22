CREATE TABLE Courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    course_id INTEGER,
    question TEXT,
    votes INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES Courses(id)
);

CREATE TABLE Answers (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    question_id INTEGER,
    answer TEXT,
    votes INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(question_id) REFERENCES Questions(id)
);

CREATE TABLE UserVotes (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    question_id INTEGER,
    answer_id INTEGER,
    FOREIGN KEY(question_id) REFERENCES Questions(id),
    FOREIGN KEY(answer_id) REFERENCES Answers(id)
);