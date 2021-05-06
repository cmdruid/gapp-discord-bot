# Discord Bot for Google Cloud
Template project for deploying a Discord Bot to Google's AppEngine and Firestore.

This README is currently a work in progress.

## Requirements
- Sign up for a [Google Cloud account](https://console.cloud.google.com).
- Setup [billing](https://console.cloud.google.com/billing) for your account.
- Access to the [gcloud utility](https://cloud.google.com/sdk/gcloud/reference).
- Enable the [Cloud Build API](https://console.cloud.google.com/cloud-build) and the [Firestore API](https://console.cloud.google.com/firestore).
- Sign up for a [Discord Developer's account](https://discord.com/developers).
- Create a new [Discord applicaton](https://discord.com/developers/applications), enable the bot feature, and copy the API token.

## Using gcloud
You can get access to gcloud through [Google's online shell](https://cloud.google.com/shell), or you can [install it to your machine](https://cloud.google.com/sdk/docs/quickstart) using Google's install script.

## Deployment Steps
While I will be using the `gcloud` utility in this guide, a lot of these tasks can also be done through your [Cloud Platform Dashboard](https://console.cloud.google.com/).

* Create a new project:
  `gcloud projects create YOUR_PROJECT_NAME`  
* Set your new project as the default in gcloud:
  `gcloud config set project YOUR_PROJECT_NAME`
* Create a new App Engine instance:
  `gcloud app create`
* Create credentials for your app to authenticate with:
  `gcloud iam service-accounts create YOUR_SERVICE_NAME`
* Bind these credentials to your project and grant ownership to your app:
  `gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME --member="serviceAccount:YOUR_SERVICE_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com" --role="roles/owner"`
* Generate a credentials file to be used for authentication.
  `gcloud iam service-accounts keys create credentials.json --iam-account=YOUR_SERVICE_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com`
* Rename the sample-app.yaml to app.yaml, and update it with your Discord API token:
  ```
  env_variables:
    DISCORD_API_TOKEN: your-discord-bot-api-token-goes-here
  ```
* Deploy your app to Google AppEngine:
  `gcloud app deploy*
  
**NOTE: The deployment may FAIL the first few times. Read the console output, you may have to enable certain features like the Firestore API and Cloud Build API.

## Development Steps
* While the deployed app will auto-magically get connected to the right credentials, you have to specify a path to your credentials.json when developing locally, using this environment variable:
`GOOGLE_APPLICATION_CREDENTIALS="credentials.json"`
*Note: *you can move/rename the file, as long as you define the correct path above.

## Keeping Your Bot Alive
By default, the Cloud AppEngine will terminate your bot application after 10-20 minutes. This template is designed to automatically restart your bot application (and keep it alive) through the use of an http server. Any requests sent to this server will extend the life of your bot application, and delay Google's executioners.

Each time you deploy, the cloud console will give you a URL to access the latest version of your application. This URL points directly to your http server, which is where we need to send our life-granting requests.

Methods for sending http requests include:
- Visit the URL directly in your browser (and smash the refresh button).
- Schedule a cron job on your machine to use `curl --request GET --url your-apps-url`
- Schedule a cron job using [Github Actions](https://github.com/features/actions) (an example is included in this template)
- Configure your app to cleverly [send out requests to a serverless proxy](https://github.com/cmdruid/cors-proxy), which then re-routes those requests back to you.

I recommend using a combination of the last two features. The keep-alive method works great once it is setup, but it needs to be kick-started with an outside network request. A cron job is the simplest and most reliable, provided you have a place to run the cron job 24/7 (Github Actions is currently unreliable with their cron jobs).
