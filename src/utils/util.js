export const searchRouter = (path, routes) => {
    let result = {}
    for (let item of routes) {
      if (item.path === path) return item
      if (item.children) {
        const res = searchRouter(path, item.children)
        if (Object.keys(res).length) result = res
      }
    }
    return result

  }
