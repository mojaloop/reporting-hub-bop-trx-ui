## Environment Variables

The application is driven by some environment variables used at build and runtime.

### Always Available Environment Variables

| Name                | Description                          | Default |
| ------------------- | ------------------------------------ | ------- |
| `REACT_APP_NAME`    | name extracted from package.json`    | -       |
| `REACT_APP_VERSION` | version extracted from package.json` | -       |
| `REACT_APP_COMMIT`  | commit extracted from git history    | -       |

### Local and Production Runtime Config Variables

| Name                     | Description                  | Default        | Used Locally | Used In A Deployment |
| ------------------------ | ---------------------------- | -------------- | ------------ | -------------------- |
| `REACT_APP_API_BASE_URL` | base url / path for api      | /reporting-api | V            | V                    |
| `REACT_APP_MOCK_API`     | enables mock api locally     | true           | V            | ?                    |
| `DEV_PORT`               | webpack server dev http port | 3001           | V            |                      |
