# NPM-COCKPIT

A user-friendly application for JavaScript developers to visualize the dependency tree of their NPM packages and get statistical info about application dependencies tree state.

## Features

Visual representation of the entire dependency tree of a project.
Detailed information about each package, including version, description, and related links.
Search function to quickly find specific package.
Identify potential issues such as outdated, deprecated or vulnerable packages.

## Requirements

Node.js and NPM installed on your computer
Application folder should contain node_modules folder with installed dependencies
Terminal or command prompt access

## Usage

### NPM
`npx npm-cockpit ~/code/my-awesome-node-project/ 8081`

where

`~/code/my-awesome-node-project/` - a path to project folder with package.json and node_modules inside
`8081` - available local port to serve the app
