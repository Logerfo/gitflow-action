const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("github-token", { required: true }),
    releaseBranch = getBranch("release"),
    devBranch = getBranch("dev"),
    masterBranch = getBranch("master"),
    label = getInput("label", "gitflow"),
    context = github.context,
    owner = context.repo.owner,
    repo = context.repo.repo,
    client = new github.GitHub(token);

function getInput(name, fallback) {
    const input = core.getInput(name);
    return input || fallback;
}

function getBranch(name) {
    return getInput(name, name);
}

function getTarget(head) {
    switch (head) {
        case releaseBranch: return masterBranch;
        case masterBranch: return devBranch;
        default: return null;
    }
}

async function run() {
    core.debug(JSON.stringify(context.payload));
    switch (github.context.eventName) {
        case "push":
            await push();
            break;

        case "pull_request":
            await pr();
            break;
    }
}

async function push() {
    const head = context.ref.substr(11),
        base = getTarget(head);
    if (!base) {
        core.info(`Branch ${head} is neither ${masterBranch} or ${releaseBranch}. Skipping...`);
        return;
    }
    const creationResponse = await client.pulls.create({
        base,
        head,
        owner,
        repo,
        title: `${head} -> ${base}`,
    }),
        creationData = creationResponse.data,
        pull_number = creationData.number;
    core.info(`Pull request #${pull_number} created.`);
    core.debug(JSON.stringify(creationData));
    const labelsResponse = await client.issues.addLabels({
        issue_number: pull_number,
        labels: [label],
        owner,
        repo
    });
    core.info(`Label ${label} added to #${pull_number}.`);
    core.debug(JSON.stringify(labelsResponse.data));
    await merge(pull_number);
}

async function pr() {
    const pull_number = context.number;
    if (context.pull_request.labels.includes(label)) {
        await merge(pull_number);
    }
}

async function merge(pull_number) {
    const mergeResponse = await client.pulls.merge({
        owner,
        pull_number,
        repo,
    });
    core.info(`Pull request #${pull_number} merged.`);
    core.debug(JSON.stringify(mergeResponse.data));
}

run();
