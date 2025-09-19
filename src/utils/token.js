// Генерація accessToken
export function generateAccessToken(user) {
  return (
    user._id.toString() +
    "_" +
    Math.random().toString(36).substr(2) +
    "_" +
    Date.now()
  );
}