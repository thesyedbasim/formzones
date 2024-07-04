export const successMessageDisocordResponse = () => {
  return Response.json(
    { message: 'Message sent to the channel!' },
    { status: 200 }
  );
};
