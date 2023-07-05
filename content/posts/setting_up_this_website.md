+++
title = "Setting Up This Website"
description = ""
type = ["posts","post"]
tags = [
    "go",
    "golang",
    "hugo",
    "development",
]
date = "2023-07-03"
categories = [
    "Development",
    "golang",
]
series = ["Hugo 101"]
[ author ]
  name = "Hubert Choo"
+++

## Step 1. Install Hugo, Go, Dart Sass

Go to [Hugo Installation](https://gohugo.io/installation/) and download the
appropriate version for your OS and architecture.

I used the Winget Packet Manager to install the Hugo Extended Edition.
``` sh
winget install Hugo.Hugo.Extended
```

## Step 2. Set Up Github Pages with Hugo

Follow this [guide](https://carpentries-incubator.github.io/blogging-with-hugo-and-github-pages/02-locally-setup-hugo/index.html) to set up Github Pages for use with Hugo.

The Hugo theme [Hello Friend NG](https://github.com/rhazdon/hugo-theme-hello-friend-ng) is used. Configuration settings for the Hugo theme is also in the link.

## Step 3. Set Up Github Action for Deployment

Instead of instructions from the above link, the [following Github Action](https://gohugo.io/hosting-and-deployment/hosting-on-github/) is set up to auto-deploy on push.

## Step 4. Creating a New Post

Create a new md file in the directory /posts/___.md.

## Step 5. Preview the Website Before Pushing

Do 
``` sh
hugo server
```
