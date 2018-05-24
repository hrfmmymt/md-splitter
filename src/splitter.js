require('string.prototype.repeat')
const remark = require('remark')
const mkdirp = require('mkdirp').sync
const path = require('path')
const nlcstToString = require('nlcst-to-string')
const fs = require('fs')

function splitContent(content) {
  const ast = remark.parse(content)
  let splitByLine = []
  let fileId = 0
  ast.children.forEach(function(node) {
    splitByLine[fileId] = splitByLine[fileId] || []
    if (node.type === 'thematicBreak') {
      fileId++
    } else {
      splitByLine[fileId].push(node)
    }
  })
  return splitByLine
}

/**
 *
 * @param {Array} contentNodeList mdast node list
 * @param {string} outputDir output directory path
 * @param {string} summaryPath? SUMMARY.md path
 * @param {string} prefix? ouput file prefix
 */
function writeSplitContents(contentNodeList, prefix, outputDir, summaryPath) {
  let summary = []
  let baseDir = ''
  if (summaryPath) {
    baseDir = path.relative(path.dirname(summaryPath), outputDir)
  }
  mkdirp(outputDir)
  contentNodeList.forEach(function(nodeList, index) {
    const heading = nodeList[0]
    const level = heading.depth
    const title = nlcstToString(heading)
    const fileName = prefix + '-' + (index + 1) + '.md'
    const indent = '\t'
    const splitContent = remark.stringify({
      type: 'root',
      children: nodeList
    })
    const summaryLine =
      indent.repeat(level - 1) +
      '- [' +
      title +
      '](' +
      path.join(baseDir, fileName) +
      ')'
    summary.push(summaryLine)
    fs.writeFileSync(path.join(outputDir, fileName), splitContent, 'utf-8')
  })
  if (summaryPath) {
    tryToWriteSummary(summaryPath, summary.join('\n'))
  }
}

function tryToWriteSummary(summaryPath, content) {
  fs.writeFileSync(summaryPath, content, 'utf-8')
}

module.exports = {
  splitContent: splitContent,
  writeSplitContents: writeSplitContents
}
