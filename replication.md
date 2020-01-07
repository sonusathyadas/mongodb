## Replication in MongoDB
----
Replication helps you to create highly available database servers. It helps you to synchronize data between multiple servers. This ensures reliability and high availability of database. You can recover from the data loss that occurs due to server failures. Replica can be used as a backup that helps for disaster recovery. Additionally, the replica can be used as a read-only server that reduces the latency for read requests. 

### Replication in MongoDB
Replication in MongoDB is implemented using *Replica Set*. A *Replica Set* is a set of MongoDB instances that holds the seme set of data. It follows *Primary-Secondary* pattern where all write operations will happens only own Primary replica. All updates will be then replicated to the secondaries. There can be only one primary and multiple secondaries. Secondaries apply operations from the primary asynchronously. A ReplicaSet will have minimum of 3 nodes.
![Replication](resources/replica-set.svg)

The secondaries replicate the primary’s oplog and apply the operations to their data sets such that the secondaries’ data sets reflect the primary’s data set. If the primary is unavailable, an eligible secondary will hold an election to elect itself the new primary. Although clients cannot write data to secondaries, clients can read data from secondary members.

A secondary can become a primary. If the current primary becomes unavailable, the replica set holds an election to choose which of the secondaries becomes the new primary. In the following three-member replica set, the primary becomes unavailable. This triggers an election where one of the remaining secondaries becomes the new primary.
![Replication](resources/replica-set-election.svg)

#### Arbiter node
Whe nthe primary goes down an election happens between the secondaries to elect one as the primary. If the replicaset contains even number of replicas an extra mongod instance can be added as an *Arbiter*. An arbiter does not maintains the data instead it is used to maintain the quorum in a replica set. It responds to the heartbeat requests and election requests by other replica set members. As they do not store data it is cheaper to maintain an arbiter. Arbiters do not require dedicated hardware. 
![Arbiter](resources/replica-set-arbiter.svg)

#### Automatic failover of instances
When a primary does not communicate with the other members of the set for more than the configured electionTimeoutMillis period (10 seconds by default), an eligible secondary calls for an election to nominate itself as the new primary. The replica set cannot process write operations until the election completes successfully. The replica set can continue to serve read queries if such queries are configured to run on secondaries while the primary is offline.

### Setting up Replica Set on localhost machine
In this session we will be setting up a replica set on our localhost machine. For that we will create 3 instances of mongodb server locally. Follow the steps to create a replica set.

1. Open command prompt and switch to C:\ drive
    > cd /
2. Create a directory named 'replicaset'.
    > md replicaset
3. Move to the newly created directory and create three sub directories with the names 'data1', 'data2' and 'data3' respectively.
    ```
    cd replicaset
    md data1
    md data2
    md data3
    ```
4. We are going to create three instances of mongodb server running on 3 different port numbers. Here, we can select port numbers 27011, 27012, 27013 respectively. Assign the replica set name as 'rs0'. You can use three different command prompts to run these instances.
    > mongod --dbpath "C:\replicaset\data1" --port 27011 --replSet rs0

    > mongod --dbpath "C:\replicaset\data2" --port 27012 --replSet rs0

    > mongod --dbpath "C:\replicaset\data3" --port 27013 --replSet rs0

5. Now, open another command prompt and run the following command to connect one of the instance.
    > mongo localhost:27011
6. Run the following command to initialize the replicaset with the member instances.
    ```
    rs.initiate( {
    _id : "rs0",
    members: [
        { _id: 0, host: "localhost:27011" },
        { _id: 1, host: "localhost:27012" },
        { _id: 2, host: "localhost:27013" }
    ]
    });
    ```
7. Check the replica set configuration by using the following command.
    > rs.conf();
8. Once you initialize the replicaset, one instance will become primary and other two will become secondaries. Your command prompt will be changed to **MongoDB Enterprise rs0:PRIMARY>** after initilizing the replicaset. If you are not on the primary instance and one any secondary your prompt will be like **MongoDB Enterprise rs0:SECONDARY>**. To perform database write operations you need to exit the secondary and connect to the primary instance.
9. Run the following commands to create a collection and insert a single record to it.
    ```
    use sampledb;
    db.items.insertOne({
	    name:'Sample item',
	    description:'This is sample item description'
    })
    ```
    This will insert a new document to primary instance. It will be replicated to all secondaries asynchronously.
10. To verify the replication process, open a new command prompt and connect to one of the secondaries.
    > mongo localhost:27012
11. Currently, all slaves (secondaries) are not configured for read. You can enable read from secondaries by running the following command in the secondary connection.
    > db.getMongo().setSlaveOk();
12. Check whether the database and collection are replicated to secondaries by running the following commands.
    ```
    use sampledb;
    db.getCollectionNames();
    db.items.find();
    ```
    ```
    MongoDB Enterprise rs0:SECONDARY> db.getMongo().setSlaveOk();
    MongoDB Enterprise rs0:SECONDARY> use sampledb;
    switched to db sampledb
    MongoDB Enterprise rs0:SECONDARY> db.getCollectionNames();
    [ "items" ]
    MongoDB Enterprise rs0:SECONDARY> db.items.find();
    { "_id" : ObjectId("5e14b96061a685cd04a0f98f"), "name" : "Sample item", "description" : "This is sample item description" } 
    ```
13. You can also verify the automatic failover of the instances when the primary goes down. To test this, exit from all mongo shells you have connected. Stop the primary instance by pressing the Ctrl+ C.
14. Try to connect to the previous primary instance by running the following command.
    > mongo localhost:27011
15. You will see an error message indicating the connection failure.
16. Now, you can try to connect to another instance by running the following command.
    > mongo localhost:27012
17. If the selected instance is elected as the primary you will see the command prompt as **MongoDB Enterprise rs0:PRIMARY>**. If the selected instance is still showing as secondary, you can connect to the next instance to verify it.

---
Reference: [https://docs.mongodb.com/v3.4/replication/](https://docs.mongodb.com/v3.4/replication/)