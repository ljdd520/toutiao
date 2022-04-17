/**
 * 本地存储模块
 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    // 不是JSON直接返回
    return err
  }
}

export const setItem = (name, value) => {
  // 如果value是对象，就把value转换为JSON格式化字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}
