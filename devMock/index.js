module.exports = (app) => {
  app.get('/mock/:name', (req, res) => {
    const { name } = req.params
    const resData = require(`./data/${name}.json`)
    res.json(resData)
  })
}
