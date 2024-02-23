import { Configuration } from "openai";

export const configureOpenAI = () => {
  const apiKey = process.env.OPEN_AI_SECRET;
  const organizationId = process.env.OPENAI_ORGANIZATION_ID;

  if (!apiKey || !organizationId) {
    //console.log("Hi from error");
    throw new Error("Missing OpenAI API credentials in environment variables.");
  }

  const config = new Configuration({
    apiKey,
    organization: organizationId,
  });

  return config;
};
