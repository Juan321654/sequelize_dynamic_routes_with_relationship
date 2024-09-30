const express = require('express');
const app = express();
const port = 3000;
const models = require('./models');

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

function buildInclude(associations) {
     return Object.values(associations).map(association => {
          const include = association.target.associations ? buildInclude(association.target.associations) : [];
          return {
               model: association.target,
               as: association.as,
               include
          };
     });
}

Object.keys(models).forEach(modelName => {
     const Model = models[modelName];

     if (Model.name !== 'sequelize' && Model.name !== 'Sequelize') {
          // Read all - GET /api/model
          app.get(`/api/${modelName.toLowerCase()}`, async (req, res) => {
               try {
                    // const include = Object.values(Model.associations).map(association => ({
                    //      model: association.target,
                    //      as: association.as
                    // }));

                    const include = buildInclude(Model.associations);
                    const instances = await Model.findAll({ include });
                    res.status(200).json(instances);
               } catch (error) {
                    res.status(500).json({ error: error.message });
               }
          });

          // Read by ID - GET /api/modelName/:id
          app.get(`/api/${modelName.toLowerCase()}/:id`, async (req, res) => {
               try {
                    const include = buildInclude(Model.associations);
                    const instance = await Model.findByPk(req.params.id, { include });
                    if (!instance) {
                         return res.status(404).json({ error: `${modelName} not found` });
                    }
                    res.status(200).json(instance);
               } catch (error) {
                    res.status(500).json({ error: error.message });
               }
          });

          app.post(`/api/${modelName.toLowerCase()}`, async (req, res) => {
               try {
                    const instance = await Model.create(req.body);
                    res.status(201).json(instance);
               } catch (error) {
                    res.status(500).json({ error: error.message });
               }
          });

          // Update by ID - PUT /api/modelName/:id
          app.put(`/api/${modelName.toLowerCase()}/:id`, async (req, res) => {
               try {
                    const [updated] = await Model.update(req.body, {
                         where: { id: req.params.id }
                    });
                    if (!updated) {
                         return res.status(404).json({ error: `${modelName} not found` });
                    }
                    res.status(200).json({ message: `${modelName} updated successfully` });
               } catch (error) {
                    res.status(500).json({ error: error.message });
               }
          });

          // Delete by ID - DELETE /api/modelName/:id
          app.delete(`/api/${modelName.toLowerCase()}/:id`, async (req, res) => {
               try {
                    const deleted = await Model.destroy({
                         where: { id: req.params.id },
                         individualHooks: true  // This will trigger the beforeDestroy hook in the model file
                    });
                    if (!deleted) {
                         return res.status(404).json({ error: `${modelName} not found` });
                    }
                    res.status(200).json({ message: `${modelName} deleted successfully` });
               } catch (error) {
                    res.status(500).json({ error: error.message });
               }
          });
     }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))