import express from 'express';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta de uploads
const UPLOADS_DIR = './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Servir archivos estáticos
app.use('/uploads', express.static(UPLOADS_DIR));

// Manejo de datos
const DATA_FILE = './users.json';
function cargarUsuarios() {
  return fs.existsSync(DATA_FILE)
    ? JSON.parse(fs.readFileSync(DATA_FILE))
    : [];
}
function guardarUsuarios(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}
let users = cargarUsuarios();

// GET con paginación
app.get('/users', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let perPage = parseInt(req.query.per_page) || 6;
  let total = users.length;
  let totalPages = Math.ceil(total / perPage);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const data = users.slice(start, end);

  res.json({
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
    data
  });
  
});

// GET por id
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  user ? res.json({data:user}) : res.status(404).send('No encontrado');
});

// POST con soporte de archivo
app.post('/users', upload.single('avatar'), (req, res) => {
  let avatarUrl = req.body.avatar || null;
  if (req.file) {
    avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  const nuevo = { id: Date.now(), ...req.body, avatar: avatarUrl };
  users.push(nuevo);
  guardarUsuarios(users);
  res.status(201).json(nuevo);
});

// PUT con soporte de archivo
app.put('/users/:id', upload.single('avatar'), (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('No encontrado');

  let avatarUrl = req.body.avatar || users[index].avatar;
  if (req.file) {
    avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  users[index] = { id: users[index].id, ...req.body, avatar: avatarUrl };
  guardarUsuarios(users);
  res.json(users[index]);
});

// DELETE
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  guardarUsuarios(users);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de usuarios en puerto ${PORT}`));
