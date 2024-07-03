import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  constructDiscordApiUrl,
  postMessageToDiscord,
  handleFormDataDiscord,
  handleJsonDataDiscord,
} from '../../../lib/discord/discord_utils';
import {
  invalidBodyContentTypeResponse,
  invalidRequestParamsResponse,
} from '@/lib/api_utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const schema = z.object({
    webhook_id: z.string(),
    webhook_token: z.string(),
    access_token: z.string(),
  });

  const reqParams = {
    webhook_id: searchParams.get('webhook_id'),
    webhook_token: searchParams.get('webhook_token'),
    access_token: searchParams.get('access_token'),
  };

  const { success: isSchemaValid } = schema.safeParse(reqParams);
  if (!isSchemaValid) return invalidRequestParamsResponse();

  type BodyContentType = 'multipart/form-data' | 'application/json';

  const bodyContentTypes: { [key: string]: BodyContentType } = {
    formData: 'multipart/form-data',
    json: 'application/json',
  };

  const reqBodyContentType = req.headers.get('Content-Type') as BodyContentType;

  const acceptedBodyContentTypes = z.union([
    z.string().startsWith(bodyContentTypes.formData),
    z.string().startsWith(bodyContentTypes.json),
  ]);

  const { success: isBodyContentTypeValid } =
    acceptedBodyContentTypes.safeParse(reqBodyContentType);
  if (!isBodyContentTypeValid) return invalidBodyContentTypeResponse();

  const [discordMessageEmbed, discordMessageEmbedError] =
    reqBodyContentType.startsWith('multipart/form-data')
      ? await handleFormDataDiscord(req)
      : await handleJsonDataDiscord(req);
  if (discordMessageEmbedError) return discordMessageEmbedError;

  const discordUrl = constructDiscordApiUrl(
    reqParams.webhook_id!,
    reqParams.webhook_token!
  );

  const [messagePostedSuccessResponse, messagePostError] =
    await postMessageToDiscord(discordUrl, discordMessageEmbed);
  if (messagePostError) return messagePostError;

  return messagePostedSuccessResponse;
}
