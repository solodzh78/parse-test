// преобразует строку в массив объектов вида {'символ': количество таких символов в строке}
const strToObject = str => (
  str.split('').reduce((akk, item) => {
    akk[item] = !akk[item] ? 1 : akk[item] + 1;
    return akk;
  }, {}));

// вычисляет процент различия между двумя строками
export const compareSrtings = (str1, str2) => {
  const var1 = strToObject(str1);
  const var2 = strToObject(str2);
  let sum = 0, total = 0;
  for (key in var1) {
    sum += Math.abs(var1[key] - (var2[key] ? var2[key] : 0));
    total += var1[key];
  }
  console.log('(sum / total * 100): ', (sum / total * 100));
  return (sum / total * 100)
}
