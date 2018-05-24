#!/usr/bin/env node
const splitContent = require('./splitter').splitContent
const writeSplitContents = require('./splitter').writeSplitContents

const concat = require('concat-stream')
const fs = require('fs')
const path = require('path')
const exist = require('exists-sync')
const file = process.argv[2]
const argv = require('minimist')(process.argv.slice(2))
const input =
  file && file !== '-' ? fs.createReadStream(process.argv[2]) : process.stdin

input.pipe(
  concat(function(buf) {
    const astNodeList = splitContent(buf.toString('utf8'))
    // -p --prefix output origin file name prefix
    const prefix = argv.prefix || argv.p
    // -o --output output directory path
    const outputDir = argv.output || argv.o
    // --summary summary path
    const summaryPath = argv.summary

    if (summaryPath) {
      writeSplitContents(
        astNodeList,
        prefix,
        outputDir,
        path.resolve(process.cwd(), summaryPath)
      )
    } else {
      const defaultSummaryPath = path.resolve(process.cwd(), 'SUMMARY.md')
      if (exist(defaultSummaryPath)) {
        writeSplitContents(astNodeList, prefix, outputDir, defaultSummaryPath)
      } else {
        writeSplitContents(astNodeList, prefix, outputDir)
      }
    }
  })
)
