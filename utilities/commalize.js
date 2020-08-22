export default function commalize (string) {
  return string.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
