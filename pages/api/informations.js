import { mongooseConnect } from "@/lib/mongoose";
import { Information } from "@/models/Information";

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
      informationCategory,
      tags,
      status,
    } = req.body;

    const informationDoc = await Information.create({
      title,
      slug,
      images,
      description,
      informationCategory,
      tags,
      status,
    });

    res.json(informationDoc);
  }

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Information.findById(req.query.id));
    } else {
      res.json((await Information.find()).reverse());
    }
  }

  if (method === "PUT") {
    const {
      _id,
      title,
      slug,
      images,
      description,
      informationCategory,
      tags,
      status,
    } = req.body;

    await Information.updateOne(
      { _id },
      {
        title,
        slug,
        images,
        description,
        informationCategory,
        tags,
        status,
      }
    );

    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Information.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
