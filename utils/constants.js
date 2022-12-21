const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)$/;

const messages = {
  notFound: 'Запрашиваемый ресурс не найден',
  forbidden: 'Доступ запрещен',
  unauthorized: 'Необходима авторизация',
  alreadyRegistred: 'Пользователь с таким email уже существует',
  validation: 'Переданы некорректные данные',
  authorizationSuccessful: 'Авторизация прошла успешно',
  signoutSuccessful: 'Выход из аккаунта прошел успешно',
  notAuthorized: 'Необходима авторизация',
};

module.exports = { REGEX, messages };
