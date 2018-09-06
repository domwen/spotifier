app.get('/user', (req, res) => {
    db.getUserById(req.session.user)
        .then(data => res.json(data))
        .catch(err => res.sendStatus(500));
});

app.get('/user', async (req, res) => {
    try {
        const data = await db.getUserById(req.session.user);
        res.json(data);
    } catch (e) {
        res.sendStatus(500);
    }
});
