FROM mcr.microsoft.com/playwright:v1.43.1-focal

COPY . /e2e-playwright

WORKDIR /e2e-playwright

RUN npm install

CMD [ "npx", "playwright", "test", "--reporter=list" ]