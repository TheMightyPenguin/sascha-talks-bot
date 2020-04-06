import { APIGatewayProxyHandler } from "aws-lambda";
import { Polly } from "aws-sdk";
import Telegraf from "telegraf";

const polly = new Polly();

const handler: APIGatewayProxyHandler = async (event, _context) => {
  const body = JSON.parse(event.body ?? "{}");
  const bot = new Telegraf("1000759519:AAHNFBgEdWG1oQ5Kemnh1QjZ8G29DyHM6Gk");

  console.log("got body", JSON.stringify(body, null, 2));

  console.log(`EVENT: Synthetize "${body.message.text}"`);
  const speech = await polly
    .synthesizeSpeech({
      LanguageCode: "de-DE",
      Text: body.message.text,
      OutputFormat: "mp3",
      TextType: "text",
      VoiceId: "Marlene",
    })
    .promise();

  // @ts-ignore
  const audioBuffer = new Buffer(speech.AudioStream);

  bot.on("text", async (ctx) => {
    console.log("EVENT: text");
    await ctx.reply(`Hi, here's your audio for: "${body.message.text}"`);
    await ctx.replyWithAudio({ source: audioBuffer });
  });

  console.log("EVENT: start handle");
  await bot.handleUpdate(body);
  console.log("EVENT: end handle");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World!",
      body,
    }),
  };
};

export { handler };