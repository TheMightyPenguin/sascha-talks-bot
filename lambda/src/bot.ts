import { APIGatewayProxyHandler } from "aws-lambda";

const handler: APIGatewayProxyHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World!",
    }),
  };
};

export { handler };
