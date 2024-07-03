import { invalidBodyResponse } from '@/lib/api_utils';
import { NextRequest } from 'next/server';

export const successMessageDisocordResponse = () => {
  return Response.json(
    { message: 'Message sent to the channel!' },
    { status: 200 }
  );
};

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
