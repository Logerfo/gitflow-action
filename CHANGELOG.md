## 0.0.5 - 2022-08-29
- New input: `release-regex`.
  - Default value: `null`.
  - If not null, allow multiple branches to match the input pattern.
  - Matched branches are considered to be release branches.
  - Can be assigned simultaneously with the `release` literal input.

## 0.0.4 - 2019-11-13
- `auto-merge` input now also accepts comma separated events:
  - `pull_request_review`;
  - `check_run`;
  - `push`.
- New input: `require_merge`.
  - Default value: `false`.
  - If `true`, the action is considered to have failed if an attempted merge fails.
- Added new info output for the `check_run` event when the payload has a empty pull request list.

## 0.0.3 - 2019-10-25
- Fixed race condition when triggered by the `check_run` event.
- Debugging is now better.

## 0.0.2 - 2019-10-22
Fixed pull request search not considering the head branch.

## 0.0.1 - 2019-10-22
Initial release.
