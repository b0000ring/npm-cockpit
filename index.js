#!/usr/bin/env node

const { spawn } = require('child_process')

console.log(__dirname)

const args = [`${__dirname}/__main__.py`, ...process.argv.slice(2)]

const pythonProcess = spawn('python', args)

pythonProcess.stdout.setEncoding('utf8')
pythonProcess.stdout.on('data', (data) => {
  console.log(data)
});

pythonProcess.on('close', () => {
  pythonProcess.kill()
});

process.on('SIGINT', exit)
process.on('exit', exit);
process.on('uncaughtException', exit)

function exit() {
  pythonProcess.kill()
  process.exit()
}