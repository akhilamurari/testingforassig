// app/lib/sequelize.ts
import { Sequelize, DataTypes } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || 'app';
const DB_PASS = process.env.DB_PASS || 'app';
const DB_NAME = process.env.DB_NAME || 'appdb';

export const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  dialect: 'postgres',
  logging: false,
});

export const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'posts', timestamps: true, createdAt: 'createdAt', updatedAt: false });

export async function initDb() {
  await sequelize.authenticate();
  await Post.sync(); // simple auto-sync for scaffold
}
