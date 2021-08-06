const Sequelize = require ('sequelize')
const { STRING } = Sequelize.DataTypes
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/people_places_things_db')

const Person = db.define('person', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Place = db.define('place', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Thing = db.define('thing', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Souvenir = db.define('souvenir', {})
Souvenir.belongsTo(Person)
Souvenir.belongsTo(Place)
Souvenir.belongsTo(Thing)

const syncAndSeed = async () => {
    await db.sync({ force:true })
    const [moe, lary, lucy, ethyl] = await Promise.all([
        Person.create({name: 'moe'}),
        Person.create({name: 'larry'}),
        Person.create({name: 'lucy'}),
        Person.create({name: 'ethyl'}),
    ])
    const [paris, nyc, chicago, london] = await Promise.all([
        Place.create({name: 'paris'}),
        Place.create({name: 'nyc'}),
        Place.create({name: 'chicago'}),
        Place.create({name: 'london'}),
    ])
    const [foo, bar, bazz, quq] = await Promise.all([
        Thing.create({name: 'foo'}),
        Thing.create({name: 'bar'}),
        Thing.create({name: 'bazz'}),
        Thing.create({name: 'quq'}),
    ])

    await Souvenir.create({
        personId: moe.id,
        placeId: london.id,
        thingId: foo.id
    })

    await Souvenir.create({
        personId: moe.id,
        placeId: paris.id,
        thingId: bar.id
    })

    await Souvenir.create({
        personId: ethyl.id,
        placeId: nyc.id,
        thingId: bazz.id
    })

}

module.exports = {
    syncAndSeed,
    models: {
        Person,
        Place,
        Thing,
        Souvenir
    }
}