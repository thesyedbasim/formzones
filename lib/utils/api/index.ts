import jwt from 'jsonwebtoken';
import {
  invalidBodyContentTypeResponse,
  notAuthenticatedReponse,
} from './responses';
import z from 'zod';
import { FunctionApiHandlerReturnType } from '@/lib/types/functionApiHandlers';

export const validateBearerToken = (
  token: Headers | string
):
  | [{ userUid: string; email: string; plan: string }, null]
  | [null, Response] => {
  let bearerToken: string;

  if (token instanceof Headers) {
    const authorizationHeader = token.get('Authorization');

    if (!authorizationHeader) return [null, notAuthenticatedReponse()];

    const authorizationHeaderArray = authorizationHeader.split(' ');

    if (
      authorizationHeaderArray.length !== 2 ||
      authorizationHeaderArray[0] !== 'Bearer' ||
      !authorizationHeaderArray[1].trim()
    )
      return [null, notAuthenticatedReponse()];

    bearerToken = authorizationHeaderArray[1];
  } else {
    bearerToken = token;
  }

  try {
    const decoded = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET_ACCESS_TOKEN!
    ) as { userUid: string; email: string; plan: string };

    return [decoded, null];
  } catch (err) {
    return [null, notAuthenticatedReponse()];
  }
};

export const createBearerToken = (payload: {
  userUid: string;
  email: string;
  plan: string;
}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN!);

  return token;
};

export const validateBodyContentType = <T>(
  acceptedBodyContentTypes: string[],
  reqBodyContentType: string
): FunctionApiHandlerReturnType<string> => {
  const bodyContentTypesValidator = z.union(
    //@ts-ignore
    acceptedBodyContentTypes.map((el) => z.string().startsWith(el))
  );

  const { success: isBodyContentTypeValid } =
    bodyContentTypesValidator.safeParse(reqBodyContentType);
  if (!isBodyContentTypeValid) return [null, invalidBodyContentTypeResponse()];

  return [reqBodyContentType, null];
};
