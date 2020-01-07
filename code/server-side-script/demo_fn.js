db.system.js.save({
    _id: 'custom_id',
    value: function (collectionName, prefix) {
        var entity, entities, curNum = 0, id, customID, limit;
        var collection = db.getCollection(collectionName);

        // find last entity that uses specified prefix
        var entities = collection.find({ custom_id: { $regex: '^' + prefix + '[0-9]+', $options: 'i' } })
            .sort({ _id: -1 }).limit(1);
        if (entities.hasNext()) {
            entity = entities.next();
        }
        if (entity && entity.custom_id) {
            // remove the prefix to determine last number
            curNum = parseInt(entity.custom_id.split(prefix).join(''));
        }

        // save the document and confirm it went well
        // we will try five times max to prevent the loop from never ending
        limit = 5;
        do {
            customID = prefix + ++curNum;
            id = ObjectId();
            collection.insert({ _id: id, custom_id: customID });
        } while (!collection.count({ _id: id }) && --limit);

        return id || false;
    }
});