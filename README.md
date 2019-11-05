# Reserve Tennis Courts in SF!

Extended from [gcloud-function-selenium-boilerplate](https://github.com/ccorcos/gcloud-function-selenium-boilerplate).

## Setup
- [Signup for Google Cloud](https://console.cloud.google.com)
- Create a new project project.
- Install the `gcloud` cli tool.
	```sh
	brew cask install google-cloud-sdk
	```
- Login
	```sh
	gcloud auth login
	```
- Find the project id you just created and set it as the current project.
	```sh
	gcloud projects list
	gcloud config set project tennis-sf
	```

## Development
- Start the development server (you may have to build the first bundle `npm run build` before you do this.)
	```sh
	npm start
	```
- Test that its working
	```sh
	curl http://localhost:8080/
	```

## Deploying
- [Read about it here](https://cloud.google.com/functions/docs/deploying/filesystem)
- Build the TypeScript files:
	```sh
	npm run build
	```
- Edit the package.json deploy script to reference the name of the function you want to deploy. Currently, it's called `selenium`.
- Deploy
	```sh
	npm run deploy
	```
- The deployment should log an endpoint url that you can test.
	```sh
	curl https://us-central1-tennis-sf.cloudfunctions.net/selenium
	```
