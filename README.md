## Reel-Food Backend

Node.js/Express backend for Reel-Food: a short-form food video platform with user accounts, food partner accounts, likes, saves, and media uploads via ImageKit.

### Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (httpOnly cookie)
- **Security/Utils**: bcryptjs, cookie-parser, cors, dotenv
- **Uploads**: multer (memoryStorage) + ImageKit SDK

### Project Structure
```
backend/
  server.js
  package.json
  src/
    app.js
    db/db.js
    controllers/
      auth.controller.js
      food.controller.js
      food-partner.controller.js
    middlewares/
      auth.middleware.js
      multer.middleware.js
    models/
      user.model.js
      food.model.js
      likes.model.js
      saved.model.js
      foodpartner.model.js
    routes/
      auth.route.js
      food.route.js
      food-partner.route.js
    services/
      storage.service.js
```

### Getting Started
1) Prerequisites
- Node.js 18+ and npm
- MongoDB instance and credentials
- ImageKit account (for media uploads)

2) Install dependencies
```bash
npm install
```

3) Environment variables
Create a `.env` file in `backend/` with:
```bash
PORT=3000
CLIENT_URL=frontend_url

# MongoDB
DB_URI=mongodb_url
DB_NAME=db_name

# Auth
JWT_SECRET=replace-with-a-strong-secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=imagekit_url
```

4) Run the server (with nodemon)
```bash
npm start
```
Server starts at `http://localhost:3000`. Health check: `GET /` -> `{ success: true, message: "API is working" }`.

### Scripts
- `npm start`: Run `nodemon server.js`

### API Overview
Base URL: `http://localhost:3000`

- Root
  - `GET /` → API health

- Auth (`/api/auth`)
  - `POST /user/register` → Register user `{ fullName, email, password }`
  - `POST /user/login` → Login user `{ email, password }` (sets `token` cookie)
  - `GET /user/logout` → Logout user (clears cookie)
  - `POST /food-partner/register` → Register partner `{ name, email, password, phone, address, contactName }`
  - `POST /food-partner/login` → Login partner `{ email, password }` (sets `token` cookie)
  - `GET /food-partner/logout` → Logout partner

- Food (`/api/food`)
  - `GET /` → List food items
  - `POST /add-food` → Create food (partner auth required)
    - multipart/form-data fields: `video` (file, required), `name` (string), `description` (string)
  - `POST /like` → Toggle like on a food (user auth required) `{ foodId }`
  - `POST /save` → Toggle save on a food (user auth required) `{ foodId }`
  - `GET /save` → Get saved foods for the current user (user auth required)

- Food Partner (`/api/food-partner`)
  - `GET /:id` → Get food partner profile plus their food items (user auth required)

Notes:
- Auth middleware reads JWT from `token` httpOnly cookie. Cookies are set with `secure: true` and `sameSite: "None"`; use HTTPS or appropriate dev tooling.

### Data Models (Mongoose)
- `User`: `fullName`, `email` (unique), `password` (select: false)
- `FoodPartner`: `name`, `contactName`, `phone` (unique), `address`, `email` (unique), `password` (select: false)
- `Food`: `name`, `video`, `description?`, `foodPartner` (ref), `likeCount`, `saveCount`
- `Like`: `user` (ref), `food` (ref)
- `Save`: `user` (ref), `food` (ref)

### Configuration Details
- CORS: `origin` is set from `CLIENT_URL`; `credentials: true` is enabled.
- Uploads: `multer.memoryStorage()` buffers the file and `ImageKit.upload()` stores it; store your keys in `.env`.
- DB: `mongoose.connect(DB_URI, { dbName: DB_NAME })`.


