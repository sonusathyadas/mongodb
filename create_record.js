
conn = new Mongo();

db= conn.getDB('sampledb');

db.products.insert({
    name:'Apple',
    price:25,
    quantity:34
})
print('A new product inserted into products collection');