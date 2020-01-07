## Monitoring Mongodb database
----
Monitoring is a critical component of all database administration. A firm grasp of MongoDB’s reporting will allow you to assess the state of your database and maintain your deployment without crisis. Additionally, a sense of MongoDB’s normal operational parameters will allow you to diagnose problems before they escalate to failures.

### Monitoring strategies
MongoDB provides various methods for collecting data about the state of a running MongoDB instance
* From version 4.0, MongoDB offers free cloud monitoring for standalones and replica sets
* A set of tools distributed with mongodb for real-time reporting of database activities.
* Database commands available that returns the statistics of the current database.
* `MongoDB Atlas` is a cloud-hosted database-as-a-service for running, monitoring, and maintaining MongoDB deployments.
* `MongoDB Cloud Manager` is a hosted service that monitors running MongoDB deployments to collect data and provide visualization and alerts based on that data.
* `MongoDB Ops Manager` is an on-premise solution available in `MongoDB Enterprise Advanced` that monitors running MongoDB deployments to collect data and provide visualization and alerts based on that data.

### Free monitoring 
Enable or disable the free monitoring during runtime using db.enableFreeMonitoring() and db.disableFreeMonitoring(). 

### Utitlies distributed with Mongodb
#### Mongostat.exe
`mongostat` captures and returns the counts of database operations by type (e.g. insert, query, update, delete, etc.). These counts report on the load distribution on the server. Use `mongostat` to understand the distribution of operation types and to inform capacity planning. 
To run the `mongostat.exe` on the command prompt and run the following command
> mongostat.exe

If you have enabled the authentication for the database server, you need to run the command with the following options
> mongostat --authenticationDatabase admin --username &lt;username&gt; --password &lt;password&gt;

If you are getting an error regarding the authorization something like
> Failed: (Unauthorized) not authorized on admin to execute command { serverStatus: 1, recordStats: 0, lsid: { id: UUID("75b2ace3-2aca-401d-a961-27f8305f677b") }, $db: "admin" }

To resolve this add the `clusterMonitor` role to the user. Run the following command to assign role to the user.
```
db.grantRolesToUser(
    "username-here",
    [
      { role: "clusterMonitor", db: "admin" }
    ]
)
```
Run the `mongostat.exe` again with the credentials. You will see the following output
```
C:\Users\sonus>mongostat --authenticationDatabase admin --username labuser --password Password@123
insert query update delete getmore command dirty used flushes vsize  res qrw arw net_in net_out conn                time
    *0    *0     *0     *0       0     0|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   111b   34.8k    2 Jan  7 16:31:26.596        *0    *0     *0     *0       0     0|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   110b   34.5k    2 Jan  7 16:31:27.607
    *0    *0     *0     *0       0     0|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   108b   33.6k    2 Jan  7 16:31:28.644
    *0    *0     *0     *0       0     1|0  0.0% 0.0%       1 5.38G 166M 0|0 1|0   117b   36.7k    2 Jan  7 16:31:29.595
    *0    *0     *0     *0       0     0|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   111b   34.8k    2 Jan  7 16:31:30.598
    *0    *0     *0     *0       0     1|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   112b   35.0k    2 Jan  7 16:31:31.595
    *0    *0     *0     *0       0     0|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   111b   34.9k    2 Jan  7 16:31:32.595
    *0    *0     *0     *0       0     0|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   111b   34.9k    2 Jan  7 16:31:33.596
    *0    *0     *0     *0       0     1|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   112b   35.0k    2 Jan  7 16:31:34.594
    *0    *0     *0     *0       0     2|0  0.0% 0.0%       0 5.38G 166M 0|0 1|0   167b   35.2k    2 Jan  7 16:31:35.591
```
#### Mongotop.exe
mongotop tracks and reports the current read and write activity of a MongoDB instance, and reports these statistics on a per collection basis.

Run the following command to execute the `mongotop.exe`
> mongotop --authenticationDatabase admin --username &lt;username&gt; --password &lt;password&gt;

```
2020-01-07T16:47:11.341+0530    connected to: mongodb://localhost/

                    ns    total    read    write    2020-01-07T16:47:12+05:30
    admin.system.roles      0ms     0ms      0ms
    admin.system.users      0ms     0ms      0ms
  admin.system.version      0ms     0ms      0ms
config.system.sessions      0ms     0ms      0ms
   config.transactions      0ms     0ms      0ms
        local.oplog.rs      0ms     0ms      0ms
  local.system.replset      0ms     0ms      0ms
  ```

  #### serverStatus() method
  The `db.serverStatus()` method returns a general overview of the status of the database, detailing disk usage, memory use, connection, journaling, and index access. The command returns quickly and does not impact MongoDB performance.
  > db.serverStatus();

  #### database, collection and replica set status
  You can get the information about your database and collection by running the following commands
  > db.stats();
  > db.collection.stats();
  > rs.status();

  The `db.stats()` returns a document that addresses storage use and data volumes. The dbStats reflect the amount of storage used, the quantity of data contained in the database, and object, collection, and index counters.

  The `db.collection.stats()` return the information similar to db.stats() including a count of the objects in the collection, the size of the collection, the amount of disk space used by the collection, and information about its indexes.

  The `rs.status()` returns an overview of your replica set’s status. The replSetGetStatus document details the state and configuration of the replica set and statistics about its members.
  
