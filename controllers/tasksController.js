const db = require('../db');

// Obtener todas las tareas, con opcional filtrado por estado
exports.getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener una tarea por ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo la tarea:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const [result] = await db.execute(
      'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)',
      [title, description, status || 'pending', due_date]
    );

    const newTask = {
      id: result.insertId,
      title,
      description,
      status: status || 'pending',
      due_date,
      created_at: new Date(),
      updated_at: new Date()
    };

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creando la tarea:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar una tarea existente
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    // Verificar si la tarea existe
    const [existingTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingTask.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Actualizar la tarea
    await db.execute(
      'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?',
      [title || existingTask[0].title, description || existingTask[0].description, status || existingTask[0].status, due_date || existingTask[0].due_date, id]
    );

    res.json({ message: 'Tarea actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando la tarea:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la tarea existe
    const [existingTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingTask.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Eliminar la tarea
    await db.execute('DELETE FROM tasks WHERE id = ?', [id]);

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando la tarea:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
