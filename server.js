const { syncAndSeed, models: { Person, Place, Thing, Souvenir } } = require ('./db')
const express = require ('express')
const app = express()

app.use(express.urlencoded({ extended: false }))

app.post('/', async (req, res, next) => {
    try {
        const souvenir = await Souvenir.create(req.body)
        res.redirect('/')
    }
    catch (err) {
        next (err)
    }
})

app.get('/', async (req, res, next) => {
    try {
        const people = await Person.findAll()
        const places = await Place.findAll()
        const things = await Thing.findAll()
        const souvenirs = await Souvenir.findAll({
            include: [ Person, Place, Thing ]
        })
        res.send(`
        <html>
        <head>
        </head>
        <body>
            <h1>Acme People, Places and Things</h1>
            <form method='POST'>
            <select name ='personId'>
            ${people.map(person => {
                return `
                <option value = ${person.id}>
                ${person.name}
                </option>
                `
            }).join('')}
            </select>
            <select name ='placeId'>
            ${places.map(place => {
                return `
                <option value = ${place.id}>
                ${place.name}
                </option>
                `
            }).join('')}
            </select>
            <select name ='thingId'>
            ${things.map(thing => {
                return `
                <option value = ${thing.id}>
                ${thing.name}
                </option>
                `
            }).join('')}
            </select>
            <button>Create</button>
            </form>
            <div>
                <ul>
                ${people.map(person => `
                <li>
                ${person.name}
                </li>
                `).join('')}
                </ul>
            </div>
            <div>
                <ul>
                ${places.map(place => `
                <li>
                ${place.name}
                </li>
                `).join('')}
                </ul>
            </div>
            <div>
                <ul>
                ${things.map(thing => `
                <li>
                ${thing.name}
                </li>
                `).join('')}
                </ul>
            </div>
            <div>
                <ul>
                ${souvenirs.map(souvenir => `
                <li>
                ${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}
                </li>
                `).join('')}
                </ul>
            </div>
        </body>
        </html>
        `)
    }
    catch (err) {
        next(err)
    }

})



const init = async () => {
    try {
        await syncAndSeed()
        const port = process.env.PORT || 3000
        app.listen(port, () => console.log(`listening on port ${port}`))
        console.log('syncAndSeeded')
    }
    catch (err) {
        console.log(err)
    }
}

init()