#!/usr/bin/env node

const { spawn } = require('child_process')
const { platform } = require('os')

const isPythonAvailable = platform().indexOf('python') > -1;
const args = [`${__dirname}/__main__.py`, ...process.argv.slice(2)]
const pythonProcess = spawn(isPythonAvailable ? 'python' : 'python3', args)

pythonProcess.stdout.setEncoding('utf8')
pythonProcess.stdout.setEncoding('utf8')
pythonProcess.stdout.on('data', (data) => {
  console.log(data)
})

pythonProcess.on('close', () => {
  pythonProcess.kill()
})

pythonProcess.on('error', function (e) {
  console.log("Failed to start python server, is `python` command available?")
})

process.on('SIGINT', exit)
process.on('exit', exit)
process.on('uncaughtException', exit)

function exit() {
  pythonProcess.kill()
  process.exit()
}