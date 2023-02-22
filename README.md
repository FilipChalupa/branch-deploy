# Branch deploy [![npm](https://img.shields.io/npm/v/branch-deploy.svg)](https://www.npmjs.com/package/branch-deploy)

Deploy by pushing a deploy\* branch made simplier.

## Usage

Run this command in your local git repository directory:

```bash
npx branch-deploy
```

It will than find all branches named `deploy*` and let you choose which one to push to. It is usually useful if you have a CI that builds/deploys your project on push to that branch.
