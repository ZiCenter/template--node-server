// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import 'reflect-metadata';

import Server from '@server';
import mongoose from 'mongoose'

const port = Number(process.env.PORT || 3000);
const server = new Server(port);

// @ts-ignore
mongoose.connect(process.env.CONNECTION_URL, {
    useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true
}, () => server.listen());

