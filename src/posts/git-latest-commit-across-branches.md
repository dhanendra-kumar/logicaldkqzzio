---
title: Find the latest git commit across all branches
date: '2018-08-23'
tags: [git, bash]
description: A one-liner that finds the most recent commit across all remote branches in a repo.
---

To find the latest git commit across all branches, build up the command piece by piece.

**List all remote branches:**

```sh
git branch -r
```

(If you want to look at local branches instead, drop `-r`. You can also write `--remote` instead of `-r`.)

**Skip `HEAD`:**

```sh
git branch -r | grep -v HEAD
```

`-v` inverts the match; `--invert-match` works too.

**Show a branch's tip commit with a date:**

```sh
git show --format="%ci %cr" branch_name
```

`%ci` is the committer date in ISO 8601; `%cr` is the relative committer date.

**Sort the results, newest first:**

```sh
sort -r
```

**Putting it all together:**

```sh
for branch in `git branch -r | grep -v HEAD`; do
  echo -e `git show --format="%ci %cr" $branch | head -n 1` \\t$branch
done | sort -r | head -1
```

Run it from the repo root to get the most recent commit across every remote branch.

Thanks Kirti for the question.

Hope this helps.
