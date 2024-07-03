export const invalidBodyResponse = () => {
  return Response.json({ message: 'Invalid body!' }, { status: 400 });
};

export const invalidRequestParamsResponse = () => {
  return Response.json({ message: 'Invalid request params!' }, { status: 400 });
};

export const invalidBodyContentTypeResponse = () => {
  return Response.json(
    { message: 'Invalid body content type!' },
    { status: 400 }
  );
};
