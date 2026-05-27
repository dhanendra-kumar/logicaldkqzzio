---
title: Git bash auto-completion on macOS
date: '2018-03-26'
tags: [git, macos]
description: Two ways to enable git command auto-completion in the macOS shell.
---

There are two ways to set up git auto-completion on macOS.

## Option 1: drop in the completion script directly

```sh
curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash \
  -o ~/.git-completion.bash \
  && echo "source ~/.git-completion.bash" >> ~/.bash_profile \
  && source ~/.bash_profile
```

Paste it into your terminal and that's it.

## Option 2: install via Homebrew

If you don't already have git installed:

```sh
brew install git && brew install bash-completion
```

If git is already installed:

```sh
brew install bash-completion
```

Then add bash-completion to your `~/.bash_profile`:

```sh
if [ -f $(brew --prefix)/etc/bash_completion ]; then
  . $(brew --prefix)/etc/bash_completion
fi
```

Source your profile or open a new terminal and auto-completion will be active.

Hope this helps.
