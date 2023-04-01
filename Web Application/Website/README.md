# Public Repo Note
Note this is a copy of the data availible in the private repo, due to the integration with CI/CD a copy of the released content would be made availible inline with FAIR principles.

Original private repo will remain this way due to permissions set up until further information is provided, if access to the private repo is desired please get intouch with the CDT.

NB, some keys, tokens and other sensitive data elements have been removed from this public repo.

---

# R2D2 Dashboard

The dashboard for the R2D2 project, created as part of Cohort 4's group project


---

# Setup
To run this server on your machine you require:
- Git
- [NodeJS](https://nodejs.org/en/) (required for npm) - 18.10.0 LTS is fine

## Install dependencies
From the root of the repo, run `npm install`, this will install the files from the package.json, from then on you should be good to go. This is a few hundred megabytes so make sure you've got space on your system

## Build Scripts
In the project directory, you can run:

### `npm start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. This will automatically reload when you make any changes to the code

### `npm build`
Builds the project into a static site which can be deployed elsewhere. Output will be placed in the `./static/` directory.

## Creating a Page
An example page showing all the elements currently available, and how to create a page with them, can be found in `./src/pages/elements.js`

---

# Contributing
- All contributions to this repo should be in a separate branch, you can call it whatever you want.
- Once your code is ready to be tested, submit a pull request to merge your branch into `dev`, explaining your changes
- After your changes have been built and tested in `dev`, and you're confident it will not break functionality, submit a PR to merge the changes from `dev` into `main`. This PR will require approval from someone else before it can be merged

# Deployments
- The `main` branch is automatically built and deployed to AWS. The most up-to-date version can be found [here](https://r2d2.systems).
- Unstable changes to the `dev-luis` branch is also automatically built and deployed to AWS. This can be found [here](https://dev.r2d2.systems).
