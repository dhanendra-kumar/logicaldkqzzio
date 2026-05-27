---
title: Installing and using the GlobalProtect VPN client on Linux
date: '2019-08-21'
tags: [vpn, linux]
description: How to install Palo Alto's GlobalProtect VPN client on Linux and connect via the CLI.
---

Get the latest GlobalProtect package from your IT administrator, or download an older one from [Dartmouth's mirror](https://software.dartmouth.edu/Linux/Connectivity/PanGPLinux-4.1.9-c3.tgz).

Open a terminal and change into your Downloads directory:

```sh
cd Downloads
tar -xvf PanGPLinux-x.x.x.tgz
```

Adjust the filename for the version you downloaded (e.g. `PanGPLinux-5.0.3.tgz`).

Change into the extracted directory and install the right package for your distro — deb, rpm, or tgz. For Ubuntu, install the deb:

```sh
cd PanGPLinux-5.0.3
sudo dpkg -i GlobalProtect_deb-5.0.3.0-10.deb
# or:
sudo apt-get install ./GlobalProtect_deb-5.0.3.0-10.deb
```

The client installs to `/opt/paloaltonetworks/globalprotect`; per-user settings and profiles live in `$HOME/.globalprotect`.

## Using GlobalProtect

Subcommands you can use:

```text
collect-log            collect log information
connect                connect to server
disconnect             disconnect
disable                disable connection
import-certificate     import a client certificate file
quit                   quit prompt mode
rediscover-network     rediscover network
remove-user            clear credentials
resubmit-hip           resubmit HIP information
set-log                set debug level
show                   show information
```

**Connect non-interactively:**

```sh
globalprotect connect --portal myportal.example.com
```

**Connect interactively:**

```sh
globalprotect
>> connect --portal myportal.example.com
```

Typical output:

```text
Retrieving configuration...
Disconnected
10.1.121.35 - portal:local:Enter login credentials
username: YourUsername
Password:
Retrieving configuration...
Discovering network...
Connecting...
Connected
```

**Disconnect:**

```sh
globalprotect disconnect
```

**Check status:**

```sh
globalprotect show --status
```

Hope this helps.
