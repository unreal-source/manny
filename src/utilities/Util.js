export function capitalize (string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

export function delay (duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

export function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function thousands (num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}