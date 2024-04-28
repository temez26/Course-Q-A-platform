TODO: There are at least five (meaningful) performance tests written with k6, included in the k6 folder. Performance test results are included in the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.

# Test with 100 vus na duration 10s test.js
     ✓ WebSocket connection established
     ✓ received getCourses response
     ✓ received getCourse response
     ✓ received getllm response
     ✓ status is 101

     checks................: 100.00% ✓ 2500       ✗ 0
     data_received.........: 1.8 MB  172 kB/s
     data_sent.............: 204 kB  20 kB/s
     iteration_duration....: avg=2.04s   p(99)=2.09s
     iterations............: 500     48.355997/s
     vus...................: 100     min=100      max=100
     vus_max...............: 100     min=100      max=100
     ws_connecting.........: avg=41.31ms p(99)=92.76ms
     ws_msgs_received......: 1500    145.067992/s
     ws_msgs_sent..........: 1500    145.067992/s
     ws_session_duration...: avg=2.04s   p(99)=2.09s
     ws_sessions...........: 500     48.355997/s


running (10.3s), 000/100 VUs, 500 complete and 0 interrupted iterations
default ✓ [ 100% ] 100 VUs  10s

# Test with 50 vus and duration 10s test.js


     ✓ WebSocket connection established
     ✓ received getCourses response
     ✓ received getCourse response
     ✓ received getllm response
     ✓ status is 101

     checks................: 100.00% ✓ 1250      ✗ 0
     data_received.........: 961 kB  95 kB/s
     data_sent.............: 102 kB  10 kB/s
     iteration_duration....: avg=2.01s   p(99)=2.03s
     iterations............: 250     24.701969/s
     vus...................: 50      min=50      max=50
     vus_max...............: 50      min=50      max=50
     ws_connecting.........: avg=11.35ms p(99)=25.88ms
     ws_msgs_received......: 750     74.105907/s
     ws_msgs_sent..........: 750     74.105907/s
     ws_session_duration...: avg=2.01s   p(99)=2.03s
     ws_sessions...........: 250     24.701969/s


running (10.1s), 00/50 VUs, 250 complete and 0 interrupted iterations
default ✓ [ 100% ] 50 VUs  10s

# test with 100vus and 10s question.js

     ✓ WebSocket connection established
     ✓ received postUpvoteQuestion response
     ✓ status is 101

     checks................: 100.00% ✓ 1017       ✗ 0
     data_received.........: 119 kB  12 kB/s
     data_sent.............: 667 kB  66 kB/s
     iteration_duration....: avg=2.01s   p(99)=2.08s
     iterations............: 500     49.311328/s
     vus...................: 100     min=100      max=100
     vus_max...............: 100     min=100      max=100
     ws_connecting.........: avg=14.66ms p(99)=82.02ms
     ws_msgs_received......: 17      1.676585/s
     ws_msgs_sent..........: 5000    493.113284/s
     ws_session_duration...: avg=2.01s   p(99)=2.08s
     ws_sessions...........: 500     49.311328/s


running (10.1s), 000/100 VUs, 500 complete and 0 interrupted iterations
default ✓ [ 100% ] 100 VUs  10s

# test with 50vus and 10s question.js

     ✓ WebSocket connection established
     ✓ status is 101

     checks................: 100.00% ✓ 500        ✗ 0
     data_received.........: 59 kB   5.8 kB/s
     data_sent.............: 333 kB  33 kB/s
     iteration_duration....: avg=2.01s   p(99)=2.02s
     iterations............: 250     24.819783/s
     vus...................: 50      min=50       max=50
     vus_max...............: 50      min=50       max=50
     ws_connecting.........: avg=11.24ms p(99)=25.89ms
     ws_msgs_sent..........: 2500    248.197832/s
     ws_session_duration...: avg=2.01s   p(99)=2.02s
     ws_sessions...........: 250     24.819783/s


running (10.1s), 00/50 VUs, 250 complete and 0 interrupted iterations
default ✓ [ 100% ] 50 VUs  10s


# Playwright tests

-  ✓  1 [e2e-headless-chromium] › tests/test-stub.spec.js:24:1 › 1 WebSocket connection and check all the courses exist (3.3s)
-  ✓  2 [e2e-headless-chromium] › tests/test-stub.spec.js:42:1 › 2 Adding question to a course (3.6s)
Course 1: Computer Science, Question: v8dpzv0skhlts9l23z4di
Course 2: Software Engineering, Question: boerjje729u0vbgjfo6j1ni
Course 3: Data Science, Question: cch03lo45f9hrgnrakyqb
Course 4: Artificial Intelligence, Question: o0dx013mfsvractfnndtt
Course 5: Machine Learning, Question: d9yth5x4s2tv7gvkgihfb
Course 6: Network Security, Question: rvfm093mkvyixx0wbwum
Course 7: Cloud Computing, Question: bnm0u1g977ei3xze974cfl
Course 8: Web Development, Question: ngjdrz6tewi20g54qbb5hij
 - ✓  3 [e2e-headless-chromium] › tests/test-stub.spec.js:73:1 › 3 Checking that the question page opens (5.4s)
Course 1: Computer Science, Question: v8dpzv0skhlts9l23z4di
Course 2: Software Engineering, Question: boerjje729u0vbgjfo6j1ni
Course 3: Data Science, Question: cch03lo45f9hrgnrakyqb
Course 4: Artificial Intelligence, Question: o0dx013mfsvractfnndtt
Course 5: Machine Learning, Question: d9yth5x4s2tv7gvkgihfb
Course 6: Network Security, Question: rvfm093mkvyixx0wbwum
Course 7: Cloud Computing, Question: bnm0u1g977ei3xze974cfl
Course 8: Web Development, Question: ngjdrz6tewi20g54qbb5hij
 - ✓  4 [e2e-headless-chromium] › tests/test-stub.spec.js:101:1 › 4 Checking the upvoting of the questions (1.9s)
 - ✓  5 [e2e-headless-chromium] › tests/test-stub.spec.js:125:1 › 5 Checking the upvoting of the answers (2.2s)
 - ✓  6 [e2e-headless-chromium] › tests/test-stub.spec.js:156:1 › 6 Checking if the llmanswers list has content (1.1s)
 - ✓  7 [e2e-headless-chromium] › tests/test-stub.spec.js:169:1 › 7 Checking if the answer inputted goes to the answer list (2.1s)

 - Slow test file: [e2e-headless-chromium] › tests/test-stub.spec.js (19.6s)
 - Consider splitting slow test files to speed up parallel execution
  7 passed (20.3s)
