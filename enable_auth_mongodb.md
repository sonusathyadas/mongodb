
## Enable authentication in MongoDb

#### To enable username/password authentication in Mongodb do the following steps

1. Start the `mongodb` server by running the following command.
    > mongod.exe --port 27017 --dbpath 'C:\data\db'
2. Open the `mongo` shell and connect to the server
    > mongo.exe --port 27017
3. Connect to the `admin` database
    > use admin;
4. Run the following command to create a user with the name `labuser`.
    ``` 
        db.createUser({
            user: "labuser",
            pwd: passwordPrompt(), // or cleartext password
            roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
        });
    ```
5. Shutdown the mongodb instance.
    > db.adminCommand( { shutdown: 1 } )
6. Exit `mongo` shell and restart the `mongod` server instance with the `--auth`  command line option. 
    > mongod --auth --port 27017 --dbpath 'C:\data\db'
7. Start the `mongo` shell and connect to the `mongod` instance with the authentication details.
    > mongo --port 27017  --authenticationDatabase "admin" -u "labuser" -p
    
    > **Note:** you can also authenticate to mongodb server after connecting using mongo shell. To do so, first connect to the server using the following command 
    <br/> > mongo --port 27017
    <br/> Then switch to the authenticating database and run the following command to provide credentials.
    <br/> > use admin;
    <br/> > db.auth('labuser', passwordPrompt());