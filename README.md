## Discord bot template for deploying to Google AppEngine and Firestore.
This README is currently a work in progress.

## BUILD STEPS

* Create a new project.
  `gcloud projects create gapp-discord-bot`  
* Set new project as the default in gcloud.
  `gcloud config set project gapp-discord-bot`
* Create a new appEngine app.
  `gcloud app create`
* Create credentials for the app to authenticate with.
  `gcloud iam service-accounts create discord-bot`
* Bind credentials to the project and grant ownership rights.
  `gcloud projects add-iam-policy-binding gapp-discord-bot --member="serviceAccount:discord-bot@gapp-discord-bot.iam.gserviceaccount.com" --role="roles/owner"`
* Generate a credentials file to be used for authentication.
  `gcloud iam service-accounts keys create credentials.json --iam-account=discord-bot@gapp-discord-bot.iam.gserviceaccount.com`
  **NOTE: you must also set the GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
  variable (where KEY_PATH points to credentials.json).**
* You may get nagged about enabling Firestore API and Cloud Build API.

## TODO
- Initial steps for installing gcloud CLI.
- Additional steps for enabling APIs (and billing).
- More information regarding the Github Actions cronjob.

## WISH LIST
- Remove express as a dependency.
- Use HEAD requests instead of GET.
- Add additional sections to README.md
- Add helpful links to Discordjs, Firestore, etc.
