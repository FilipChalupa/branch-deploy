# Branch deploy [![npm](https://img.shields.io/npm/v/branch-deploy.svg)](https://www.npmjs.com/package/branch-deploy)

Deploy by pushing to a `deploy*` branch made simplier.

## Usage

Run this command in your local git repository directory:

```bash
npx branch-deploy
```

It will then find all branches named `deploy*` and let you choose which one to push to. It is usually useful if you have a CI that builds/deploys your project on push to that branch.

![demo screencast](https://raw.githubusercontent.com/FilipChalupa/branch-deploy/HEAD/screencast.gif)

### Options

| Option                     | Description                                            | Example                                         |
| -------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| `--help`                   | Show help                                              | `npx branch-deploy --help`                      |
| `--all`                    | Push to all deploy branches                            | `npx branch-deploy --all`                       |
| `--target <branch/pattern>` | Push to specific branch or branches matching a pattern | `npx branch-deploy --target "deploy/*"`         |
| `--prefix <string>`        | Filter branches by prefix                              | `npx branch-deploy --prefix staging`            |
| `--source <hash>`          | Commit hash to push                                    | `npx branch-deploy --source 52ca70ea`           |
| `--remote <name>`          | Remote name                                            | `npx branch-deploy --remote upstream`           |
| `--force`                  | Force push                                             | `npx branch-deploy --force`                     |
| `--force-with-lease`       | Force with lease push                                  | `npx branch-deploy --force-with-lease`          |
| `--dry`                    | Dry run (don't push anything)                          | `npx branch-deploy --dry`                       |
