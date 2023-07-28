export const setItem = (obj, callback) => {
  chrome.storage.local.set(obj, callback)
}

export const getItem = (arr, callback) => {
  chrome.storage.local.get(arr, callback)
}
