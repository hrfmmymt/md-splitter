const assert = require('assert')
const splitContent = require('../src/splitter').splitContent
describe('md-splitter-test', () => {
  describe('splitContent', () => {
    it('should return array of content', () => {
      const contents = splitContent(`# Header
            
----
    
text
    
----
            `)
      assert.equal(contents.length, 3)
    })
  })
})
