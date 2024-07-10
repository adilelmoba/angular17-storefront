"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 204,
    methods: "GET, POST, PUT, DELETE",
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/clothes", (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;
    fs_1.default.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const jsonData = JSON.parse(data);
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
app.post("/clothes", (req, res) => {
    const { image, name, price, rating } = req.body;
    fs_1.default.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const jsonData = JSON.parse(data);
        const maxId = jsonData.items.reduce((max, item) => Math.max(max, item.id), 0);
        const newItem = {
            id: maxId + 1,
            image,
            name,
            price,
            rating,
        };
        jsonData.items.push(newItem);
        fs_1.default.writeFile("database.json", JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.status(201).json(newItem);
        });
    });
});
app.put("/clothes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { image, name, price, rating } = req.body;
    fs_1.default.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const jsonData = JSON.parse(data);
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
        fs_1.default.writeFile("database.json", JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.status(200).json(jsonData.items[index]);
        });
    });
});
app.delete("/clothes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    fs_1.default.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const jsonData = JSON.parse(data);
        const index = jsonData.items.findIndex((item) => item.id === id);
        if (index === -1) {
            res.status(404).send("Not Found");
            return;
        }
        jsonData.items.splice(index, 1);
        fs_1.default.writeFile("database.json", JSON.stringify(jsonData), (err) => {
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
