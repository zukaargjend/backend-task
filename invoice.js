function calculatePrice(item){
    const price = item.quantity * item.price;
    const VAT = item.VAT / 100;
    const discount = item.discount || 0;
    const priceWithDiscount = price - item.quantity * discount;

    const total = priceWithDiscount * (1 + VAT);

    return {
        total,
        subtotal: priceWithDiscount,
        calculatedVAT: total - priceWithDiscount,
    };
}

function generateInvoice(items){
    const invoiceItems = [];
    let total = 0;
    let subtotal = 0;
    let totalVAT = 0;

    for (const item of items) {
        const result = calculatePrice(item);

        const invoiceItem = {
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            VAT: item.VAT,
            discount: item.discount,
            total: result.total.toFixed(3),
            subtotal: result.subtotal.toFixed(3),
            calculatedVAT: result.calculatedVAT.toFixed(3),
        };

        totalVAT += result.calculatedVAT;
        total += result.total;
        subtotal += result.subtotal;

        invoiceItems.push(invoiceItem);
    };
    
    const invoice = {
        items: invoiceItems,
        subtotal: subtotal.toFixed(3),
        calculatedVAT: totalVAT.toFixed(3),
        total: total.toFixed(3)
    };

    return invoice;
}

// if one product is more than 500$ it is a new invoice
// no more than 500$
// one product should be max 50 times in an invoice
function generateMultipleInvoices(items) {
    const invoices = [];
    let stack = [...items]; 

    while (stack.length > 0) {
        let currentInvoiceItems = [];
        let remainingStack = [];

        for (let i = 0; i < stack.length; i++) {
            const item = stack[i];

            const { quantity } = item;
            const { total } = calculatePrice(item);
            const totalPricePerItem = total/quantity;

            if (totalPricePerItem > 500) {
                if(currentInvoiceItems.length === 0){
                    for (let j = 0; j < quantity; j++) {
                        invoices.push(generateInvoice([{ ...item, quantity: 1 }]));
                    }

                    // shtin krejt itemat e tjer n list perveq t parit
                    const leftItems = stack.slice(i+1);
                    
                    remainingStack = remainingStack.concat(leftItems);
                    break;
                }

                remainingStack.push(item);

                continue;
            }
            

            let remainingQuantity = quantity;
            const maxNumberOfItems = Math.floor(500 / totalPricePerItem); // maksimumi qe mos mu kalu 500$

            const thisQuantity = Math.min(remainingQuantity, 50, maxNumberOfItems);
            
            currentInvoiceItems.push({ ...item, quantity: thisQuantity });
            remainingQuantity -= thisQuantity;

            if (remainingQuantity > 0) {
                remainingStack.push({ ...item, quantity: remainingQuantity });
            }

            const currentInvice = generateInvoice(currentInvoiceItems);

            if(currentInvice.total > 500 && currentInvoiceItems.length > 1){
                currentInvoiceItems.pop(); // hjeke t fundit qe e ka shti me kalu $500
                if(remainingQuantity>0){
                    remainingStack.pop();
                }
                remainingStack = remainingStack.concat(stack.slice(i));
                break
            }
        }

        if (currentInvoiceItems.length > 0) {
            invoices.push(generateInvoice(currentInvoiceItems));
        }

        stack = [...remainingStack];
    }

    return invoices;
}


module.exports = {
    calculatePrice,
    generateInvoice,
    generateMultipleInvoices,
}