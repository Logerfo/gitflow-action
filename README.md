[![Dependencies Status](https://david-dm.org/logerfo/gitflow-action/dev-status.svg)](https://david-dm.org/logerfo/gitflow-action?type=dev)

# Gitflow Action
This action will automatically merge your `master` branch into `dev` and `release` into `master` through the creation of pull requests that will be automatically merged, if possible and enabled.  
Those pull requests will be identified by a label named `gitflow` as default.

## Setting up
Create a file named `.github/workflows/gitflow.yml`.

### Minimal configuration
```yml
name: Gitflow
on: 
  # To create pull requests.
  push:
  # To merge pull requests if not possible during the push run. Remove if `auto-merge` is `false`.
  pull_request_review:
  check_run:
    types: [completed]

permissions:
  contents: read
  pull-requests: write
  
jobs:
  build:
    name: Gitflow
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/gitflow-action@0.0.5
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }} # The `GITHUB_TOKEN` secret.
```

### Disabled auto merge
```yml
name: Gitflow
on: 
  # To create pull requests.
  - push 

permissions:
  contents: read
  pull-requests: write
  
jobs:
  build:
    name: Gitflow
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/gitflow-action@0.0.5
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }} # The `GITHUB_TOKEN` secret.
        auto-merge: false # If `true`, will try to automatically merge the pull requests.
```

### Complete configuration
All values are default.
```yml
name: Gitflow
on: 
  # To create pull requests.
  push:
  # To merge pull requests if not possible during the push run. Remove if `auto-merge` is `false`.
  pull_request_review:
  check_run:
    types: [completed]

permissions:
  contents: read
  pull-requests: write
  
jobs:
  build:
    name: Gitflow
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/gitflow-action@0.0.5
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }} # The `GITHUB_TOKEN` secret.
        release: release # The `release` branch.
        release-regex: ^release/(.*) # The regex for `release` branch.
        dev: dev # The `dev` branch.
        master: master # The `master` branch.
        label: gitflow # The pull request label.
        auto-merge: true # If `true`, will try to automatically merge pull requests. Can also be set to `pull_request_review`, `check_run`, `push`, or a comma-separated combination of these values to only merge when handling the named events.
        require-merge: false # If an attempted merge fails, the action is considered to have failed.
```

### Auto update
You can use (at your own risk) the `release` branch instead of the specific version tag.  
Never user `master`, since the distribution file does not exist in this branch and the action will always fail.

## Changelog
Click [here](CHANGELOG.md).

## Contributing
If you have suggestions for how close-label could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Donate

<img src="https://i.imgur.com/ndlBtuX.png" width="200">

BTC: 1LoGErFoNzE1gCA5fzk6A82nV6iJdKssSZ
