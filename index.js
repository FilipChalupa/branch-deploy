import chalk from 'chalk'
import { Command } from 'commander'
import { readFile } from 'fs/promises'
import inquirer from 'inquirer'
import { exit } from 'process'
import simpleGit from 'simple-git'

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))

const program = new Command()

program
	.name('branch-deploy')
	.description('Makes deploy by push easier.')
	.version(packageJson.version)

program
	.option('-a, --all', 'push to all deploy branches', false)
	.option(
		'-t, --target <branch name or pattern>',
		'push to specific branch or branches',
		null,
	)
	.option('-p, --prefix <string>', 'filter branches by prefix', 'deploy')
	.option('-r, --remote <name>', 'remote name', 'origin')
	.option('-s, --source <hash>', 'commit hash to push', 'HEAD')
	.option('-f, --force', 'force push', false)
	.option('--force-with-lease', 'force with lease push', false)

program.parse(process.argv)

const options = program.opts()

const remoteName = options.remote
const branchNamePrefix = options.prefix
const source = options.source
const targetPattern = options.target

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

try {
	await git.status()
} catch (error) {
	console.error(
		chalk.red(
			`Something went wrong. Are you running this command in a git repository?`,
		),
	)
	if (typeof error.message === 'string') {
		console.error(chalk.blackBright(error.message))
	}
	exit(1)
}

const remoteBranches = (await git.branch(['-r'])).all.map((branch) =>
	branch.startsWith(`${remoteName}/`)
		? branch.substring(remoteName.length + 1)
		: branch,
)

const targetBranches = await (async () => {
	if (targetPattern) {
		const patternParts = targetPattern.split('/')
		return remoteBranches.filter((branch) => {
			const branchParts = branch.split('/')
			if (branchParts.length !== patternParts.length) {
				return false
			}
			return patternParts.every(
				(patternPart, index) =>
					patternPart === '*' || patternPart === branchParts[index],
			)
		})
	}

	const deployBranches = remoteBranches.filter(
		(branch) =>
			branch === branchNamePrefix || branch.startsWith(`${branchNamePrefix}/`),
	)

	if (deployBranches.length === 0) {
		console.error(
			chalk.red(
				`Not a single deploy branch found in remote ${chalk.magenta(
					remoteName,
				)} starting with ${chalk.magenta(branchNamePrefix)}.`,
			),
		)
		exit(1)
	}

	if (deployBranches.length === 1) {
		// @TODO: ask for confirmation
		return deployBranches
	}
	if (options.all) {
		return deployBranches
	}
	return (
		await inquirer.prompt({
			type: 'checkbox',
			name: 'result',
			message: `Which branch do you want ${chalk.magenta(source)} to push to?`,
			choices: deployBranches,
		})
	).result
})()

if (targetBranches.length === 0) {
	console.log(chalk.yellow('No branch selected.'))
	exit(0)
}

if (targetBranches.length > 1) {
	console.log(`Pushing to ${chalk.magenta(targetBranches.length)} branches.`)
}

for (let i = 0; i < targetBranches.length; i++) {
	const targetBranch = targetBranches[i]
	const count =
		targetBranches.length > 1 ? `[${i + 1}/${targetBranches.length}] ` : ''
	console.log(
		`${count}Pushing ${chalk.magenta(source)} to branch ${chalk.magenta(
			targetBranch,
		)}`,
	)
	await git.push(remoteName, `${source}:${targetBranch}`, {
		...(options.force ? { '--force': null } : null),
		...(options['forceWithLease'] ? { '--force-with-lease': null } : null),
	})
}

console.log(chalk.green('Done. 🎉'))
