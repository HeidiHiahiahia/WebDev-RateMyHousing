# rate-my-housing-client

This repository contains the frontend code for rate my housing application

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the json server
npm run server

then, run the development server on a new seperate terminal:

```bash
npm run dev
# or
yarn dev
```
Note: Important Step
Install the following before running
npm i -g next
npm install -D tailwindcss
npx tailwindcss init
npm i @heroicons/react
npm i json-server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Git usage

*..Clone..*
> git clone https://git.uwaterloo.ca/team27/rate-my-housing-client.git

*..Make a branch…*
> git branch new_branch <br/>
> git checkout new_branch (this will switch to your new branch)
> git branch (this will check your current branch)

*… you do some work on your branch…*
> git add . (add every change to the commit) <br/>
> git commit -m “This is the work I did!” (describe your changes)<br/>
> git push origin branch_i_am_on (upload it to the server)<br/>

*…once we finialize on your changes, push to master…*
> git status (see the files that you made changes to; file name should be highlighted in red) <br/>
> git add <file name that you made changes to> (don't stage all your files to commit..add only the file you made changes to)</br>
> git commit -m “This is the work I did!” (describe your changes)<br/>
> git push origin master (upload it to master branch)<br/>

*…if you want to update from master; usually after you merge something to master…*
> git pull origin master (download changes in master)<br/>
> git merge master (combine your branch with the master)<br/>

