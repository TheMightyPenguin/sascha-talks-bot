import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as secretsManager from "@aws-cdk/aws-secretsmanager";

export class SaschaTalksBotStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const telegramToken = secretsManager.Secret.fromSecretAttributes(
      this,
      "SaschaTelegramToken",
      {
        secretArn:
          "arn:aws:secretsmanager:us-west-2:817483674872:secret:SaschaTelegramToken-1QsYuX",
      }
    );

    const bot = new lambda.Function(this, "BotHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "bot.handler",
      timeout: cdk.Duration.seconds(30),
      environment: {
        telegramToken: telegramToken.secretValue.toString(),
      },
    });

    // allow lambda to call polly
    bot.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["*"],
        actions: ["polly:SynthesizeSpeech"],
      })
    );

    new apiGateway.LambdaRestApi(this, "BotEndpoint", {
      handler: bot,
    });
  }
}
