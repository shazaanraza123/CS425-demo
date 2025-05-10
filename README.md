# cs425demo

finance tracker using React (frontend), Express (backend), and MySQL (database).

## Features
- User registration and login
- Track expenses, budgets, and income
- Relational schema with MySQL

## Setup & Run Locally
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up MySQL:**
   - Create a database named `cs425`.
   - Import the schema:
     ```sh
     mysql -u root -p cs425 < cs425.sql
     ```
   - (Optional) Add sample data:
     ```sh
     mysql -u root -p cs425 < sample_data.sql
     ```
3. **Configure environment:**
   - Create a `.env` file in the project root:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=cs425
     PORT=5001
     ```
4. **Start backend:**
   ```sh
   npm run server
   ```
5. **Start frontend:**
   ```sh
   npm run dev
   ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy Frontend to Netlify
1. Build the frontend:
   ```sh
   npm run build
   ```
2. Drag and drop the `dist` folder to Netlify, or connect your GitHub repo and set build command to `npm run build` and publish directory to `dist`.

**Note:** Netlify only hosts the frontend. You must host the backend (Express + MySQL) elsewhere (e.g., Render, Railway, Heroku).

---

**ER diagram:** See included image file (if provided).

**Relational schema:** See `cs425.sql`.

**Sample data:** See `sample_data.sql`. 