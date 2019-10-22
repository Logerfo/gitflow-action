const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("github-token", { required: true }),
    releaseBranch = getBranch("release"),
    devBranch = getBranch("dev"),
    masterBranch = getBranch("master"),
    label = getInput("label", "gitflow"),
    auto_merge = getInput("auto-merge", "true") == "true",
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
    try {
        core.debug(JSON.stringify(context.payload));
        switch (github.context.eventName) {
            case "push":
                await push();
                break;

            case "pull_request_review":
                if (auto_merge) {
                    if (context.payload.pull_request.labels.map(labelMap).includes(label)) {
                        await merge(context.payload.pull_request.number);
                    }
                    else {
                        core.info(`Pull request does not have the label ${label}. Skipping...`);
                    }
                }
                else {
                    core.info("Auto merge is disabled. You should remove the `pull_request_review` event from the action configuration. Skipping...");
                }
                break;

            case "check_run":
                if (auto_merge) {
                    context.payload.check_run.pull_requests.forEach(async function (element) {
                        const pull = await client.pulls.get({
                            owner,
                            pull_number: element.number,
                            repo,
                        })
                        if (pull.data.labels.map(labelMap).includes(label)) {
                            await merge(element.number);
                        }
                        else {
                            core.info(`Pull request #${element.number} does not have the label ${label}. Skipping...`);
                        }
                    });
                }
                else {
                    core.info("Auto merge is disabled. You should remove the `check_run` event from the action configuration. Skipping...");
                }
                break;
        }
    }
    catch (err) {
        //Even if it's a valid situation, we want to fail the action in order to be able to find the issue and fix it.
        core.setFailed(err.message);
    }
}

function labelMap(label) {
    return label.name;
}

async function push() {
    const head = context.ref.substr(11),
        base = getTarget(head);
    if (!base) {
        core.info(`Branch ${head} is neither ${masterBranch} or ${releaseBranch}. Skipping...`);
        return;
    }
    const pulls = await client.pulls.list({
        base,
        owner,
        repo,
        state: "open",
    });
    let pull_number;
    if (pulls.data.length == 1) {
        const data = pulls.data[0];
        pull_number = data.number;
        core.info(`Pull request already exists: #${pull_number}`);
        const labels = data.labels.map(labelMap);
        if (!labels.includes(label)) {
            core.info(`Pull request does not have the label ${label}. Skipping...`);
            return;
        }
    }
    else {
        const creationResponse = await client.pulls.create({
            base,
            head,
            owner,
            repo,
            title: `${head} -> ${base}`,
        }),
            creationData = creationResponse.data;
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
    }
    if (auto_merge) {
        await merge(pull_number);
    }
    else {
        core.info("Auto merge is disabled. Skipping...");
    }
}

async function merge(pull_number) {
    try {
        const mergeResponse = await client.pulls.merge({
            owner,
            pull_number,
            repo,
        });
        core.info(`Pull request #${pull_number} merged.`);
        core.debug(JSON.stringify(mergeResponse.data));
    }
    catch (err) {
        core.info("Merge failed.");
        core.debug(err);
    }
}

run();
