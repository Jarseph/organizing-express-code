const notes = require("../data/notes-data")

function list(req, res) {
  res.json({ data: notes });
}

let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0)

function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

function create(req, res) {
  const { data: { text } = {} } = req.body;
  const newNote = {
    id: ++lastNoteId, // Increment last id then assign as the current ID
    text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

const noteExists = (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Note id not found: ${req.params.noteId}`,
    });
  }
};

function read(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  res.json({ data: foundNote });
}

function update(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  const { data: { text } = {} } = req.body;
  foundNote.text = text
  res.json({ data: foundNote })
}

function destroy(req, res) {
  const { noteId } = req.params;
  const index = notes.find((note) => note.id === Number(noteId));
  const deletedNote = notes.splice(index, 1)
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [bodyHasTextProperty, create],
  read: [noteExists, read],
  update: [noteExists, bodyHasTextProperty, update],
  delete: [noteExists, destroy],
}