const express = require('express');
const { generateMultipleInvoices } = require('./invoice')

const app = express();
app.use(express.json());

app.post('/invoice', (req, res) => {
    const items = req.body.items;
    const invoices = generateMultipleInvoices(items);

    res.json(invoices);
});

const port = process.env.PORT || 3300;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})