CREATE TABLE Courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id UUID 
);

CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    course_id INTEGER,
    question TEXT NOT NULL,
    FOREIGN KEY(course_id) REFERENCES Courses(id)
);

CREATE TABLE Answers (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    question_id INTEGER,
    answer TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    FOREIGN KEY(question_id) REFERENCES Questions(id)
);