function checkUser(request, response) {
  if (!request.user) {
    response.status(401);
    return response.send({ message: `User not Authorised for domain ${request.headers.host}` });
  }

  return response.send({ message: `User Authorised for domain ${request.headers.host}` });
}

export default { checkUser };
