import express from 'express';
import { Flashcard, Admin } from './schema.js';
import { eq } from 'drizzle-orm';
import db from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { z } from 'zod';
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
function middleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.send({ success: false, msg: "token invalid" });
            }
            else {
                const user = await db.select().from(Admin).where(eq(Admin.adminName, decoded));
                if (user[0]) {
                    next();
                }
                else {
                    res.send({ success: false, msg: "token invalid" });
                }
            }
        });
    }
}
app.get('/flashcard', async (req, res) => {
    const flashcards = await db.select().from(Flashcard);
    res.send(flashcards);
});
app.post('/flashcard', middleware, async (req, res) => {
    const { question, answer } = req.body;
    await db.insert(Flashcard).values({ question, answer, });
    res.send({ question, answer });
});
const cardId = z.number().min(1);
app.put('/flashcard/:id', middleware, async (req, res) => {
    let id = 0;
    try {
        const tryId = cardId.parse(parseInt(req.params.id));
        id = tryId;
    }
    catch (e) {
        // console.log(e);
        res.send({ success: false, msg: "invalid id" });
        return;
    }
    const { question, answer } = req.body;
    await db.update(Flashcard).set({ question, answer }).where(eq(Flashcard.id, id));
    res.send({ question, answer });
});
app.delete('/flashcard/:id', middleware, async (req, res) => {
    let id = 0;
    try {
        const tryId = cardId.parse(parseInt(req.params.id));
        id = tryId;
    }
    catch (e) {
        // console.log(e);
        res.send({ success: false, msg: "invalid id" });
        return;
    }
    await db.delete(Flashcard).where(eq(Flashcard.id, id));
    res.send({ success: true, msg: "flashcard deleted" });
});
app.get('/flashcard/:id', async (req, res) => {
    let id = 0;
    try {
        const tryId = cardId.parse(parseInt(req.params.id));
        id = tryId;
    }
    catch (e) {
        // console.log(e);
        res.send({ success: false, msg: "invalid id" });
        return;
    }
    const flashcard = await db.select().from(Flashcard).where(eq(Flashcard.id, id));
    res.send(flashcard);
});
app.post('/signup', async (req, res) => {
    const { adminName, adminPassword } = req.body;
    const admin = await db.select().from(Admin).where(eq(Admin.adminName, adminName));
    if (admin[0]) {
        res.send({ adminName, adminPassword, success: false, msg: "admin already exists" });
    }
    else {
        const token = jwt.sign(adminName, process.env.JWT_SECRET, { algorithm: 'HS256' });
        await db.insert(Admin).values({ adminName, adminPassword });
        res.send({ adminName, adminPassword, success: true, msg: "admin created", token });
        // res.redirect('/flashcard');
    }
});
app.post('/signin', async (req, res) => {
    const { adminName, adminPassword } = req.body;
    const admin = await db.select().from(Admin).where(eq(Admin.adminName, adminName) && eq(Admin.adminPassword, adminPassword));
    if (admin[0]) {
        // console.log(process.env.JWT_SECRET);
        const token = jwt.sign(adminName, process.env.JWT_SECRET, { algorithm: 'HS256' });
        // console.log(token);
        res.send({ adminName, adminPassword, success: true, msg: "loggedin", token });
        // res.redirect('/flashcard');
    }
    else {
        res.send({ adminName, adminPassword, success: false, msg: "admin not found" });
    }
});
app.get('/cardIds', async (req, res) => {
    const cardIds = (await db.select().from(Flashcard)).map(card => card.id);
    res.send(cardIds);
});
app.post('/admin', async (req, res) => {
    const { adminName, adminPassword } = req.body;
    await db.insert(Admin).values({ adminName, adminPassword });
    res.send({ adminName, adminPassword });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
