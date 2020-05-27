import Cookies from 'js-cookie'

// item:存储名称；value:存储值
export function setCookie (item, value) {
  Cookies.set(item, value)
}

export function getCookie (item) {
  return Cookies.get(item)
}

export function removeToken (item) {
  Cookies.remove(item)
}

// item:存储名称；value:存储值
export function setSessionStorage (item, value) {
  sessionStorage.setItem(item, value)
}

export function getSessionStorage (item) {
  sessionStorage.getItem(item)
}

// item:存储名称；value:存储值
export function setLocalStorage (item, value) {
  localStorage.setItem(item, value)
}

export function getLocalStorage (item) {
  localStorage.getItem(item)
}

