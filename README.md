# NPM-COCKPIT

A user-friendly application for JavaScript developers to visualize the dependency tree of their NPM packages and get statistical info about application dependencies tree state.

## Features

Visual representation of the entire dependency tree of a project.
Detailed information about each package, including version, description, and related links.
Search function to quickly find specific package.
Identify potential issues such as outdated, deprecated or vulnerable packages.

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
