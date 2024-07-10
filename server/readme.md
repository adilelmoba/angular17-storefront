# Clothing Store API

This is a simple Express.js API for managing a collection of clothing items. The API allows you to perform CRUD (Create, Read, Update, Delete) operations on the items stored in a JSON file.

## Project Structure

```
project-root
├── dist
│ └── index.js
├── node_modules
├── src
│ └── index.ts
├── package.json
├── tsconfig.json
└── db.json
```

- **src**: Contains the TypeScript source code.
- **dist**: Contains the compiled JavaScript files.
- **db.json**: JSON file that stores the clothing items.
- **tsconfig.json**: TypeScript configuration file.
- **package.json**: Node.js project configuration file.

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).

### Installation

   ```sh
      npm install
   ```
Commands
Build the project: Compile the TypeScript files into JavaScript.

   ```sh
      npm run build
   ```
Start the server: Run the compiled JavaScript code.

   ```sh
      npm start
   ```
API Endpoints
GET /clothes: Retrieve all clothing items with pagination.

Example: GET http://localhost:3000/clothes?page=0&perPage=2

POST /clothes: Add a new clothing item.

Example: POST http://localhost:3000/clothes

Request body:

```json
{
  "image": "https://your-image-url.com/image.png",
  "name": "T-shirt",
  "price": "10",
  "rating": 4
}
```
PUT /clothes/
: Update an existing clothing item by ID.

Example: PUT http://localhost:3000/clothes/1

Request body:

```json
{
   "image": "https://your-image-url.com/image.png",
   "name": "T-shirt",
   "price": "10",
   "rating": 4
}
```
DELETE /clothes/
: Delete a clothing item by ID.

Example: DELETE http://localhost:3000/clothes/1

Notes
The server listens on port 3000 by default.
Make sure to update the db.json file with your initial data.
License
This project is licensed under the MIT License.