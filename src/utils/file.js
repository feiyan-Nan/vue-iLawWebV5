/**
 * 文件操作的相关方法类
 */
const fileUtil = {
  // 使用拖拽方式拖拽文件的时候，读取文件信息所需要使用到的类，适用于非流文件形式的文件读取
  readItems (items, cb) {
    for (let item of items) {
      readItem(item.webkitGetAsEntry(), undefined, cb)
    }
  }
}

function readItem (entry, path = '', cb) {
  if (entry.isFile) {
    entry.file(file => {
      file._name = path + file.name
      if (path.length > 0) {
        file._path = path.substring(0, path.length - 1)
      } else {
        file._path = path
      }
      cb(file)
    })
  } else if (entry.isDirectory) {
    let dirReader = entry.createReader()
    dirReader.readEntries(entries => {
      entries.forEach(item => {
        readItem(item, path + entry.name + '\n', cb)
      })
    })
  }
}

export default fileUtil