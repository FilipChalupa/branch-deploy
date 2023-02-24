# Branch deploy [![npm](https://img.shields.io/npm/v/branch-deploy.svg)](https://www.npmjs.com/package/branch-deploy)

Deploy by pushing to a `deploy*` branch made simplier.

## Usage

Run this command in your local git repository directory:

```bash
npx branch-deploy
```

It will then find all branches named `deploy*` and let you choose which one to push to. It is usually useful if you have a CI that builds/deploys your project on push to that branch.

![demo screencast](https://raw.githubusercontent.com/FilipChalupa/branch-deploy/HEAD/screencast.gif)

### Optional Options

#### Show help

```bash
npx branch-deploy --help
```

#### Push to all deploy branches

```bash
npx branch-deploy --all
```

#### Use different branch prefix

```bash
npx branch-deploy --prefix staging
```

#### Use different remote name

```bash
npx branch-deploy --prefix not-origin
```
