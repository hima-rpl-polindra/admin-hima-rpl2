import { mongooseConnect } from "@/lib/mongoose";
import { Posting } from "@/models/Posting";

export default async function handle(req, res) {
  // if authenticated, connect to Mongodb
  await mongooseConnect();

  const { method } = req;

  if (method === "POST") {
    const {
      title,
      slug,
      images,
      description,
      client,
      postingCategory,
      tags,
      livePreview,
      status,
    } = req.body;

    const postingDoc = await Posting.create({
      title,
      slug,
      images,
      description,
      client,
      postingCategory,
      tags,
      livePreview,
      status,
    });

    res.json(postingDoc);
  }

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Posting.findById(req.query.id));
    } else {
      res.json((await Posting.find()).reverse());
    }
  }

  if (method === "PUT") {
    const {
      _id,
      title,
      slug,
      images,
      description,
      client,
      postingCategory,
      tags,
      livePreview,
      status,
    } = req.body;

    await Posting.updateOne(
      { _id },
      {
        title,
        slug,
        images,
        description,
        client,
        postingCategory,
        tags,
        livePreview,
        status,
      }
    );

    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Posting.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
