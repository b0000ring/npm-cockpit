# NPM-COCKPIT

A user-friendly application for JavaScript developers to visualize the dependency tree of NPM packages and NodeJS applications. 

Allows to get statistical info about application dependencies tree state. Provides an interface for filtering and viewing information through convenient tables and diagrams.

## Features

Visual representation of the entire dependency tree of a project. With ability to look all the paths for a specific package. Dependency tree can be visualized as a tree or directed network chart

![tree chart](https://chartexample.com/images/npm-cockpit/network.jpg)

Detailed information about each package, including version, description, and related links.

![packages list](https://chartexample.com/images/npm-cockpit/list.jpg)

Identify potential issues such as outdated, deprecated or vulnerable packages.

![packages list](https://chartexample.com/images/npm-cockpit/deprecated.jpg)

**AND MUCH MORE!**


## Requirements

### General
- Terminal or command prompt access
- Target application folder should contain node_modules folder with installed dependencies and package.json
- Node.js and NPM installed

### As an NPM package
- `python` command should be available

## Usage

### Command params

`path` - a path to project folder with package.json and node_modules inside

`port` - available local port to serve the app (default `8080`)

### NPM globally installed
`npm install --global npm-cockpit`
`npm-cockpit [path] [port]`

### NPX
`npx npm-cockpit [path] [port]`

### NPM dependency in package
`npm install npm-cockpit` and add the run script in the package json with proper params

## Development
- `git clone https://github.com/b0000ring/npm-cockpit.git`
- `cd npm-cockpit`
- `node index.js [path] [port]` or `python __main__.py [path] [port]`
