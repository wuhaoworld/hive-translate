export function addIfNotExists(arr: string[], element: string) {
  if (!arr.includes(element)) {
    arr.push(element);
  }
  return arr;
}
export function removeIfExists(arr: string[], element: string) {
  const index = arr.indexOf(element);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}