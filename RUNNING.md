# How to run dev build

## First time
- run command `docker compose up --build` on the root directory
## Other times
- Just run `docker compose up` on the root directory 
# How to run prod build
- run command `docker compose --profile prod up`
## Run tests
- For playwright navigate to the folder e2e-playwright and run command `docker compose run --entrypoint=npx e2e-playwright playwright test`
- For k6 navigate to folder k6 and run command `docker run -i --network="host" -v "%cd%:/k6" grafana/k6:master-with-browser run /k6/test.js`
