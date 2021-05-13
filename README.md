# Zentala.IO [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/zentala/id.zentala.io)

## 🌍 Overview
Modern, minimalistic, one-page - developer personal home page. Hosted serverless on GitHub and developed via GitPod. Feel free to fork it for yourself!

![Design animated preview](preview.gif "Design animated preview")

Check out live example: https://id.zentala.io/

## 🏗 How to deploy your own?

### Domain preparation
If you own a domain you can deploy it, in in the subdomain with simple `CNAME` record added to yor DNS Zone. In my case `CNAME` record for `id.zentala.io` points at my GitHub profile `zentala.github.io.`. 

If you don't own domain you still can host webpage under `github.io` domain: `<your_github_username>.github.io`.

For more about GitHub Pages configuration go to the [official documentation](https://docs.github.com/en/pages). 

### Code preparation
* fork this repo and rename it into choosen domain name 
* edit `package.json` and go to `scripts` > `deploy`, change `id.zentala.io` to your domain name & commit
* edit `README.md` and replace repository URL with yours in GitPod link & commit
* install [GitPod from Marketplace](https://github.com/gitpod-io) and turn it on in the repository
* open project with GitPod & change all titles, icons, descriptions you want to change & commit
* deploy with `npm run deploy` (that will create branch `deploy` with built website)

### Turing on GitHub Pages
* having branch `deploy` built, and domain configured...
* go to repository `Settings` > `Pages`
* choose `deploy` branch from the list, click `Save`
* wait till TLS cert will be generated (that may take around 15min), check `Enforce HTTPS`

Congrats. Your website should be avaliable under choosen domain name!

## 🏗 Dependencies & Environment
* [Parcel.js](https://parceljs.org/) - web application bundler
* [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
* [GitHub Pages](https://pages.github.com/) for serverless hosting
* [GitPod](https://www.gitpod.io/) for web-development setup

## ⚡️ Online (GitPod) development
Just click `Gitpod` button above.

## 💻 Local development
### Setup
```
$ git clone git@github.com:zentala/id.zentala.io.git
$ cd id.zentala.io.git
$ nvm use .
$ npm install
```

### Development mode
```
$ npm run dev
```
Then open in the browser `http://localhost:2000/`.

### Build and deploy
```
$ npm run deploy
```
