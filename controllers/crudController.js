// Builds the five CRUD handlers for any model. Every handler has its own try/catch.

function handleError(err, res) {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  console.error(err); // log details server-side only
  return res.status(500).json({ message: 'Internal server error' });
}

module.exports = function createController(Model, label) {
  return {
    getAll: async (req, res) => {
      try {
        const items = await Model.find().sort({ createdAt: -1 });
        res.status(200).json(items);
      } catch (err) {
        handleError(err, res);
      }
    },

    getOne: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: `${label} not found` });
        res.status(200).json(item);
      } catch (err) {
        handleError(err, res);
      }
    },

    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (err) {
        handleError(err, res);
      }
    },

    update: async (req, res) => {
      try {
        // Ownership and id must not be changed through an update
        const { userId, _id, createdAt, updatedAt, ...changes } = req.body || {};
        if (Object.keys(changes).length === 0) {
          return res.status(400).json({ message: 'Request body must include at least one field to update' });
        }
        const item = await Model.findByIdAndUpdate(req.params.id, changes, {
          new: true,
          runValidators: true
        });
        if (!item) return res.status(404).json({ message: `${label} not found` });
        res.status(204).send();
      } catch (err) {
        handleError(err, res);
      }
    },

    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: `${label} not found` });
        res.status(200).json({ message: `${label} deleted` });
      } catch (err) {
        handleError(err, res);
      }
    }
  };
};
