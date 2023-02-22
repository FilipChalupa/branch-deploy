import chalk from 'chalk'
import inquirer from 'inquirer'
import { exit } from 'process'
import simpleGit from 'simple-git'

// @TODO: configurable

const remoteName = 'origin'
const branchNamePrefix = 'deploy'

const git = (() => {
	try {
		const git = simpleGit()
		return git
	} catch (error) {
		console.error(
			chalk.red(
				`Cannot communicate with git properly. Do you have git installed? Are you running this command in a git repository?`,
			),
		)
		if (typeof error.message === 'string') {
			console.error(chalk.blackBright(error.message))
		}
		exit(1)
	}
})()

// @TODO: check current working directory is git repository

const remoteBranches = (await git.branch(['-r'])).all.map((branch) =>
	branch.startsWith(`${remoteName}/`)
		? branch.substring(remoteName.length + 1)
		: branch,
)
const deployBranches = remoteBranches.filter(
	(branch) =>
		branch === branchNamePrefix || branch.startsWith(`${branchNamePrefix}/`),
)

if (deployBranches.length === 0) {
	console.error(
		chalk.red(
			`Not a single deploy branch found in "${remoteName}" starting with ${branchNamePrefix}.`,
		),
	)
	exit(1)
}

const { targetBranches } = await inquirer.prompt({
	type: 'checkbox',
	name: 'targetBranches',
	message: `Which branch do you want ${chalk.magenta('HEAD')} to push to?`,
	choices: deployBranches,
})

if (targetBranches.length === 0) {
	console.log(chalk.yellow('No branch selected.'))
	exit(0)
}

for (const targetBranch of targetBranches) {
	console.log(
		`Pushing ${chalk.magenta('HEAD')} to ${chalk.magenta(targetBranch)}…`,
	)
	await git.push(remoteName, `HEAD:${targetBranch}`)
}

console.log(chalk.green('Done. 🎉'))
