`note` This doesn’t work for relationships where the model references itself, like areas in a building for nested tree dropdowns. The dynamic routing causes an infinite loop, so another manual method has to be used.

`http://localhost:3000/api/role` will display all roles with the users as child, and including any nested relationship, in this case `role` > `user` > `post`


```js
[
    {
        "id": 1,
        "name": "Admin",
        "createdAt": "2024-09-27T19:30:42.665Z",
        "updatedAt": "2024-09-27T19:30:42.665Z",
        "users": [
            {
                "id": 2,
                "name": "Joe",
                "roleId": 1,
                "createdAt": "2024-09-27T19:35:52.075Z",
                "updatedAt": "2024-09-27T19:35:52.075Z",
                "posts": []
            },
            {
                "id": 1,
                "name": "Juan",
                "roleId": 1,
                "createdAt": "2024-09-27T19:30:57.955Z",
                "updatedAt": "2024-09-27T19:30:57.955Z",
                "posts": [
                    {
                        "id": 1,
                        "content": "test",
                        "userId": 1,
                        "createdAt": "2024-09-27T19:31:19.053Z",
                        "updatedAt": "2024-09-27T19:31:19.053Z"
                    }
                ]
            }
        ]
    }
]
```

when to use `hooks` in `Classes` 
if in a route we are deleting data by first finding the id and then using `destroy` then in the class we need to use `beforeDestroy`

```js
const buildingId = req.params.id;
const floors = await sequelize.models.Floor.findAll({ where: { buildingId } });

// Destroy each floor individually to trigger its own beforeDestroy
for (const floor of floors) {
    // console.log(`Destroying floor ${floor.id}`);
    await floor.destroy();
}

// Floor Class
class Floor extendes Model {....
Floor.beforeDestroy(async (floor, options) => {
    await sequelize?.models?.CustomWidgetsController?.destroy({
        where: {
            floorId: floor.id
        }
    });
});
```

but if we are deleting by using the `where` keyword, then we need to use `beforeBulkDestroy`

```js
const buildingId = req.params.id;
const floors = await sequelize.models.Floor.destroy({ where: buildingId })

// Floor Class
class Floor extendes Model {....
Floor.beforeBulkDestroy(async (options) => {
          if (options?.where?.id) {
               await sequelize?.models?.CustomWidgetsController?.destroy({
                    where: {
                         floorId: options?.where?.id
                    }
               });
          }
});
```

NOTE: when using `beforeBulkDestroy` inside a `class` and we are exptecting to cascade another `beforeDestroy` inside another `class` we must find the id's and destroy individually
```js
//Building class
Building.beforeBulkDestroy(async (options) => {
          if (options?.where?.id) {
               const buildingId = options.where.id;
               const floors = await sequelize.models.Floor.findAll({ where: { buildingId } });

               // Destroy each floor individually to trigger its own beforeDestroy
               for (const floor of floors) {
                    // console.log(`Destroying floor ${floor.id}`);
                    await floor.destroy();
               }
          }
     });

//Floor class
Floor.beforeDestroy(async (floor, options) => {
          await sequelize?.models?.CustomWidgetsController?.destroy({
               where: {
                    floorId: floor.id
               }
          });
     });

```

