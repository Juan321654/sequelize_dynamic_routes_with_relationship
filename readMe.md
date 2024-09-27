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