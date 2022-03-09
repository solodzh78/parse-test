//Преобразование объекта в FormData
function objectToFormData(data) {
  const formData = new FormData();
  for (let key in data) {
    formData.set(key, data[key]);
  }
  return formData
}

//Отправка POST запроса
export async function postData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: objectToFormData(data)
    });
    return await response.text();
  }
  catch (error) {
    console.error(error);
  }
}