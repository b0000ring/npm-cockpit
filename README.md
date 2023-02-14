# NPM-COCKPIT

A user-friendly application for JavaScript developers to visualize the dependency tree of their NPM packages and get statistical info about application dependencies tree state.

## Features

Visual representation of the entire dependency tree of a project. With ability to look all the paths for a specific package.

![tree chart](https://chartexample.com/images/npm-cockpit/tree.png)

Detailed information about each package, including version, description, and related links.

![packages list](https://chartexample.com/images/npm-cockpit/list.png)

Identify potential issues such as outdated, deprecated or vulnerable packages.

![packages list](https://chartexample.com/images/npm-cockpit/deprecated.png)

General statistic information about project state

![packages list](https://chartexample.com/images/npm-cockpit/statistic.png)

**AND MANY MORE!**


## Requirements

- Node.js and NPM installed
- Application folder should contain node_modules folder with installed dependencies
- Terminal or command prompt access
- python command should be available

## Usage

### NPM globally installed
`npm install --global npm-cockpit`
`npm-cockpit [path] [port]`

where

`path` - a path to project folder with package.json and node_modules inside

`port` - available local port to serve the app (default `8080`)

### NPX
`npx npm-cockpit [path] [port]`

### NPM dependency in package
`npm install npm-cockpit` and add the run script in the package json with proper params

## Development
- `git clone https://github.com/b0000ring/npm-cockpit.git`
- `cd npm-cockpit`
- `node index.js [path] [port]` or `python __main__.py [path] [port]`
