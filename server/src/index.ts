import express, { Request, Response } from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const port = 3000;

interface Item {
  id: number;
  image: string;
  name: string;
  price: string;
  rating: number;
}

interface JsonData {
  items: Item[];
}

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/clothes", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 0;
  const perPage = parseInt(req.query.perPage as string) || 10;

  fs.readFile("database.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData: JsonData = JSON.parse(data);

    const start = page * perPage;
    const end = start + perPage;

    const result = jsonData.items.slice(start, end);

    res.status(200).json({
      items: result,
      total: jsonData.items.length,
      page,
      perPage,
      totalPages: Math.ceil(jsonData.items.length / perPage),
    });
  });
});

app.post("/clothes", (req: Request, res: Response) => {
  const { image, name, price, rating } = req.body;

  fs.readFile("database.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData: JsonData = JSON.parse(data);

    const maxId = jsonData.items.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );

    const newItem: Item = {
      id: maxId + 1,
      image,
      name,
      price,
      rating,
    };

    jsonData.items.push(newItem);

    fs.writeFile("database.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
});

app.put("/clothes/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { image, name, price, rating } = req.body;

  fs.readFile("database.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData: JsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items[index] = {
      id,
      image,
      name,
      price,
      rating,
    };

    fs.writeFile("database.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json(jsonData.items[index]);
    });
  });
});

app.delete("/clothes/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  fs.readFile("database.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData: JsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items.splice(index, 1);

    fs.writeFile("database.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
