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
  - push 
  # To merge pull requests if not possible during the push run. Remove if `auto-merge` is `false`.
  - pull_request_review
  - check_run
    types: [completed]
    
jobs:
  build:
    name: Gitflow
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/gitflow-action@0.0.1
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"
```

### Complete configuration
All values are default.
```yml
name: Gitflow
on: 
  # To create pull requests.
  - push 
  # To merge pull requests if not possible during the push run. Remove if `auto-merge` is `false`.
  - pull_request_review
  - check_run
    types: [completed]
    
jobs:
  build:
    name: Gitflow
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/gitflow-action@0.0.1
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"
        release: release
        dev: dev
        master: master
        label: gitflow
        auto-merge: true
```

### Auto update
You can use (at your own risk) the `release` branch instead of the specific version tag.

## Changelog
Click [here](CHANGELOG.md).

## Contributing
If you have suggestions for how close-label could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Donate

<img src="https://i.imgur.com/ndlBtuX.png" width="200">

BTC: 1LoGErFoNzE1gCA5fzk6A82nV6iJdKssSZ
