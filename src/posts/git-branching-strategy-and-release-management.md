---
title: A successful git branching strategy and release management
date: '2018-03-11'
tags: [git, release-management]
description: A practical git branching model with release and hotfix flows.
---

I've seen many developers wrestle with version control. Over many projects and many branching models, here's one that works.

## Normal flow

![Git normal flow](/images/blog/git/normal-flow.jpg)

In the above flow:

1. Development, release, and hotfix branches fork from master.
2. Every feature branch forks from development.
3. Feature branches merge back to development.
4. Development merges to release.
5. Bug fixing during testing happens in the release branch.
6. Release merges to master. (Master goes to production.)
7. Add a tag for the release on master.
8. Release merges back to development.
9. Rebase all feature branches that are not in master.

## Hotfix flow

![Git hotfix flow](/images/blog/git/hotfix-flow.jpg)

For hotfixes on production:

1. Fork a hotfix branch from master.
2. Fix the bug in the hotfix branch.
3. Merge the hotfix to master.
4. Add a tag for the hotfix.
5. Merge the hotfix to development.
6. Rebase all feature branches that are not in master.

## Commands

Fork a new feature branch from development:

```sh
git checkout development
git checkout -b feature_branch
# or, in one step:
git checkout -b feature_branch development
```

Merge a feature branch back to development:

```sh
git checkout development
git merge --no-ff feature_branch
```

`--no-ff` disables fast-forwarding, creating an explicit merge commit instead of putting all the feature commits directly on development. This preserves the historical existence of the feature branch.

Add a tag:

```sh
git tag -a 1.0.0 -m "Version 1.0.0 release"
```

`-a` adds the tag; `-m` sets the message (optional). Use `-s` or `-u <key>` to sign the tag cryptographically.

Rebase a feature branch:

```sh
git checkout feature_branch
git rebase <source_branch_or_tag>
git push origin feature_branch
```

Delete a local feature branch:

```sh
git branch -d feature_branch
```

This errors if the branch hasn't been merged anywhere. Use `-D` instead to force-delete an unmerged branch.

Hope this helps.
