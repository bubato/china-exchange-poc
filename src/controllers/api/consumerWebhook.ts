import { Request, Response } from "express";

import { ConsumerWebhook } from "../../models/ConsumerWebhook";
import { User } from "../../models/User";

export const getAllConsumerWebhooks = async (req: Request, res: Response) => {
  try {
    const webhooks = await ConsumerWebhook.find();

    return res.status(200).json(webhooks);
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const addConsumerWebhook = async (req: Request, res: Response) => {
  const { url, userId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send("user not found");
    }

    const webhook = await ConsumerWebhook.create({
      url,
      userId,
    });

    return res.status(201).json(webhook);
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const editConsumerWebhook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const form = req.body;

  try {
    const user = await User.findOne({ _id: form.userId });

    if (!user && form.userId) {
      return res.status(404).send("user not found");
    }

    const webhook = await ConsumerWebhook.findByIdAndUpdate(id, form, {
      new: true,
    });

    return res.status(201).json(webhook);
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const deleteConsumerWebhook = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await ConsumerWebhook.deleteOne(id);

    return res.status(201).send("deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
};
