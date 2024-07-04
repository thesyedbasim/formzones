import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  constructDiscordApiUrl,
  postMessageToDiscord,
  handleFormDataDiscord,
  handleJsonDataDiscord,
  validateDiscordWebhookSearchParams,
} from '@/lib/utils/discord';
import { validateBearerToken, validateBodyContentType } from '@/lib/utils/api';

import { incrementUserInvocation } from '@/lib/firebase/admin/auth';

export async function POST(req: NextRequest) {
  const [searchParams, validateSearchParamsError] =
    validateDiscordWebhookSearchParams(req.nextUrl.searchParams);
  if (validateSearchParamsError) return validateSearchParamsError;

  const [accessTokenDecoded, validateAccessTokenError] = validateBearerToken(
    searchParams.access_token
  );
  if (validateAccessTokenError) return validateAccessTokenError;

  const [bodyContentType, validateBodyContentTypeError] =
    validateBodyContentType(
      ['multipart/form-data', 'application/json'],
      req.headers.get('Content-Type')!
    );
  if (validateBodyContentTypeError) return validateBodyContentTypeError;

  const [discordMessageEmbed, discordMessageEmbedError] =
    bodyContentType.startsWith('multipart/form-data')
      ? await handleFormDataDiscord(req)
      : await handleJsonDataDiscord(req);
  if (discordMessageEmbedError) return discordMessageEmbedError;

  const discordUrl = constructDiscordApiUrl(
    searchParams.webhook_id,
    searchParams.webhook_token
  );

  const [messagePostedSuccessResponse, messagePostError] =
    await postMessageToDiscord(discordUrl, discordMessageEmbed);
  if (messagePostError) return messagePostError;

  await incrementUserInvocation(accessTokenDecoded.userUid);

  return messagePostedSuccessResponse;
}
