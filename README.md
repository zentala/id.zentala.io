# id.zentala.pl [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/zentala/id.zentala.pl) [![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/emersion/stability-badges#stable)

## 🌍 Overview
Modern, minimalistic, one-page, simple in every way developer personal home page. 

### Simple Tech Stack

![SCSS](https://img.shields.io/badge/-SCSS-C6538C?logo=sass&logoColor=white) ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)

### Time-Efficient
* **fork for yourself and customize**
* instantly enter into ready-to-code development IDE with GitPod 
* personalize easily
* host serverless & free on Cloudflare Workers


Feel free to fork it for yourself and use for your needs! 

![Design animated preview](preview.gif "Design animated preview")

Check out live example: https://id.zentala.pl/

## 📊 Code quality status

[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=bugs)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=zentala_id.zentala.io&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=zentala_id.zentala.io)

## 🏗 How to deploy your own?

Hosted on **Cloudflare Workers** (static assets). The domain must be a zone on the
same Cloudflare account — `wrangler deploy` then creates the DNS record and the TLS
cert on its own, so there is nothing to click in the dashboard.

### Code preparation
* fork this repo and rename it into chosen domain name
* edit `wrangler.toml`: set `name`, your `account_id`, and the `routes` pattern to your domain
* edit `README.md` and replace repository URL with yours in GitPod link & commit
* open the project & change all titles, icons, descriptions you want to change & commit

### Deploy
```
$ npx wrangler login
$ npm run deploy
```
`npm run deploy` builds with Parcel into `deploy/` and ships it to Cloudflare.

Congrats. Your website should be available under the chosen domain name!

> **`wrangler.toml` gotcha:** keep `routes` **above** the `[assets]` table header.
> TOML assigns every key after a table header to that table, so `routes` placed below
> silently becomes `assets.routes` — wrangler only warns (`Unexpected fields found in
> assets field: "routes"`), deploys, and your domain never gets attached.

## 📦 Dependencies & Environment 
* [Parcel.js](https://parceljs.org/) - web application bundler
* [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
* [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) for serverless hosting
* [GitPod](https://www.gitpod.io/) for web-development setup

## 📚 Technical Stack Overview

## ⚡️ Online (GitPod) development
Just click `Gitpod` button above.

## 💻 Local development
### Setup
```
$ git clone git@github.com:zentala/id.zentala.pl.git
$ cd id.zentala.pl
$ nvm use .
$ npm install
```

### Development mode
```
$ npm run dev
```
Then open in the browser `http://localhost:2000/`.

### Build only
```
$ npm run build
```

### Build and deploy
```
$ npm run deploy
```


