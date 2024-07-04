import {
  invalidBodyResponse,
  invalidRequestParamsResponse,
} from '@/lib/utils/api/responses';
import { NextRequest } from 'next/server';
import { successMessageDisocordResponse } from './responses';
import z from 'zod';
import { FunctionApiHandlerReturnType } from '@/lib/types/functionApiHandlers';
import { DiscordWebhookSearchParams } from '@/lib/types/discord';

export const constructDiscordApiUrl = (
  webhook_id: string,
  webhook_token: string
) => {
  return `https://discord.com/api/webhooks/${webhook_id}/${webhook_token}`;
};

export const postMessageToDiscord = async (
  discordUrl: string,
  embeds: { embeds: { fields: { name: string; value: string }[] }[] }
): Promise<[Response, null] | [null, Response]> => {
  console.log('the embed obj', embeds);

  try {
    await fetch(discordUrl, {
      body: JSON.stringify(embeds),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    return [successMessageDisocordResponse(), null];
  } catch (err) {
    return [null, invalidBodyResponse()];
  }
};

export const handleFormDataDiscord = async (
  req: NextRequest
): Promise<
  | [{ embeds: { fields: { name: string; value: string }[] }[] }, null]
  | [null, Response]
> => {
  const embedFieldsArray: { name: string; value: string }[] = [];

  try {
    const formData = await req.formData();

    formData.forEach((value, key) => {
      embedFieldsArray.push({ name: key, value: value as string });
    });

    return [{ embeds: [{ fields: embedFieldsArray }] }, null];
  } catch (err) {
    return [null, invalidBodyResponse()];
  }
};

export const handleJsonDataDiscord = async (
  req: NextRequest
): Promise<
  | [{ embeds: { fields: { name: string; value: string }[] }[] }, null]
  | [null, Response]
> => {
  const embedFieldsArray: { name: string; value: string }[] = [];

  try {
    const jsonData = await req.json();

    console.log('json data', jsonData);

    jsonData.forEach(({ name, value }: { name: string; value: string }) => {
      embedFieldsArray.push({ name, value });
    });

    return [{ embeds: [{ fields: embedFieldsArray }] }, null];
  } catch (err) {
    return [null, invalidBodyResponse()];
  }
};

export const validateDiscordWebhookSearchParams = (
  searchParams: URLSearchParams
): FunctionApiHandlerReturnType<DiscordWebhookSearchParams> => {
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
  if (!isSchemaValid) return [null, invalidRequestParamsResponse()];

  return [reqParams as DiscordWebhookSearchParams, null];
};
