const express = require('express');

const app = express();
app.use(express.json());

// const items = [
//     {
//         description: 'Water',
//         quantity: 240,
//         price: 0.25,
//         VAT: 8,
//         // discount: 0
//     },

//     {
//         description: 'Chips',
//         quantity: 38,
//         price: 2.40,
//         VAT: 8,
//         // discount: 0
//     },

//     {
//         description: 'TV',
//         quantity: 1,
//         price: 760,
//         VAT: 22,
//         // discount: 0
//     },

//     {
//         description: 'Coca-cola',
//         quantity: 77,
//         price: 0.50,
//         VAT: 18,
//         discount: 0.10
//     },

//     {
//         description: 'Chocolate',
//         quantity: 38,
//         price: 1.25,
//         VAT: 22,
//         // discount: 0
//     },

//     {
//         description: 'Hand-soap',
//         quantity: 92,
//         price: 3.78,
//         VAT: 8,
//         // discount: 0
//     },

//     {
//         description: 'fish',
//         quantity: 49,
//         price: 8.30,
//         VAT: 18,
//         // discount: 0 
//     },

//     {
//         description: 'Humus',
//         quantity: 16,
//         price: 2.66,
//         VAT: 18,
//         // discount: 0 
//     },

//     {
//         description: 'White-wine',
//         quantity: 18,
//         price: 9.20,
//         VAT: 18,
//         discount: 0.02 
//     },

//     {
//         description: 'banana', 
//         quantity: 8,
//         price: 1.25,
//         VAT: 22,
//         // discount: 0 
//     },

//     {
//         description: 'Wine', 
//         quantity: 22,
//         price: 9.78,
//         VAT: 22,
//         // discount: 0 
//     },

//     {
//         description: 'Oil', 
//         quantity: 10,
//         price: 8.30,
//         VAT: 18,
//         // discount: 0 
//     },

//     {
//         description: 'Cigarettes',
//         quantity: 89,
//         price: 5.46,
//         VAT: 22,
//         // discount: 0 
//     },

//     {
//         description: 'Cookies', 
//         quantity: 33,
//         price: 1.34,
//         VAT: 8,
//         // discount: 0 
//     },

//     {
//         description: 'Yogurts', 
//         quantity: 14,
//         price: 0.66,
//         VAT: 18,
//         // discount: 0 
//     },

//     {
//         description: 'Bleach',
//         quantity: 11,
//         price: 1.23,
//         VAT: 22,
//         // discount: 0 
//     },

//     {
//         description: 'Napkins',
//         quantity: 85,
//         price: 0.21,
//         VAT: 8,
//         // discount: 0 
//     },

//     {
//         description: 'Eggs', 
//         quantity: 104,
//         price: 0.16,
//         VAT: 18,
//         // discount: 0 
//     },

//     {
//         description: 'Bags',
//         quantity: 398,
//         price: 0.05,
//         VAT: 18,
//         // discount: 0 
//     },

//     {
//         description: 'Alumin-foils', 
//         quantity: 21,
//         price: 1.12,
//         VAT: 8,
//         // discount: 0 
//     },

//     {
//         description: 'Razors', 
//         quantity: 51,
//         price: 8.10,
//         VAT: 8,
//         // discount: 0 
//     },

//     {
//         description: 'Lotions', 
//         quantity: 205,
//         price: 12,
//         VAT: 22,
//         // discount: 0,
//     }
// ];

function calculatePrice(item){
    const price = item.quantity * item.price;
    const VAT = item.VAT / 100;
    const discount = item.discount || 0;
    const priceWithDiscount = price - item.quantity * discount;
    const total = priceWithDiscount * (1 + VAT);
    return total;
}

app.post('/invoice', (req, res) => {
    const items = req.body.items;
    const invoiceItems = [];
    let subtotal = 0;

    for (const item of items) {
        const calculatedPrice = calculatePrice(item);
        const totalItemPrice = calculatedPrice.toFixed(3);

        const invoiceItem = {
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            VAT: item.VAT,
            discount: item.discount,
            total_price: totalItemPrice
        };

        invoiceItems.push(invoiceItem);
        subtotal += calculatedPrice;
    };

    const VAT = subtotal * 0.01;
    const total = subtotal + VAT;
    
    const invoice = {
        items: invoiceItems,
        subtotal: subtotal.toFixed(3),
        VAT: VAT.toFixed(3),
        total: total.toFixed(3)
    };

    res.json(invoice);
});


const port = process.env.PORT || 3300;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})