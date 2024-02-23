import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { configureOpenAI } from "../config/openai-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { model } from "mongoose";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }
    //grab chats of the user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    //send all chats to OpenAI

    const config = configureOpenAI();

    const openai = new OpenAIApi(config);
    console.log(chats);
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    user.chats.push(chatResponse.data.choices[0].message);
    await user.save();

    //get latest response
    console.log("about to return 200");
    return res.status(200).json({
      chats: user.chats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        message: "User not registered",
      });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: `Permissions didn't match` });
    }
    return res.status(200).json({
      message: "OK",
      chats: user.chats,
    });
  } catch (error) {
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        message: "User not registered",
      });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: `Permissions didn't match` });
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};
