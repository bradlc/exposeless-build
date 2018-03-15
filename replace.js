const str = `
  <div>
    <div data-reactroot>
      <div>hello, world</div>
      <div>foobar</div>
    </div>
  </div>
`

const start = str.indexOf('<div data-reactroot')

const open = allIndexOf(str, '<div', start + 1)
const close = allIndexOf(str, '</div>', start + 1)

const end = close[open.length] + 6

console.log(str.substring(start, end))

function allIndexOf(str, toSearch, start) {
  const indices = []
  for (
    let pos = str.indexOf(toSearch, start);
    pos !== -1;
    pos = str.indexOf(toSearch, pos + 1)
  ) {
    indices.push(pos)
  }
  return indices
}
