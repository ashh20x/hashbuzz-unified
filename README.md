# Hashbuzz

## Environment variables
For running this project on your local machine please add a `.env` file on root of the project folder.below are the details of the file required for the environment config:

    VITE_NETWORK=hedera network
    VITE_BASE_URL= Base url for the twitter redirection.

### Certificate generate cmd
    `openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem`