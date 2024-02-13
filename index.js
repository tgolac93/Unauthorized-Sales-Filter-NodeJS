const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// endpoint
app.post('/unauthorizedSales', (req, res) => {
    const { productListings, salesTransactions } = req.body;

    // Check the data input format validity
    if (!Array.isArray(productListings) || !Array.isArray(salesTransactions)) {
        return res.status(400).json({ error: 'Invalid input format! Please use Arrays.' });
    }

    // Checks for appropriate JSON fields
    if (!productListings || !salesTransactions) {
        return res.status(400).json({ error: 'Please include productListings and salesTransactions in your input!' });
    }


    const unauthorizedSalesList = [];

    // Loop through sales transactions to identify unauthorized sales
    salesTransactions.forEach(sale => {
        
        const authorizedSellerID = productListings.find(item => item.productID === sale.productID)?.authorizedSellerID;
        
        //if the authorizedSellerID exists and if it's different from a seller id
        if (authorizedSellerID && (authorizedSellerID !== sale.sellerID)) {
            unauthorizedSalesList.push({ productID: sale.productID, unauthorizedSellerID: sale.sellerID });
        }
    });

    return res.status(200).json({ unauthorizedSales: unauthorizedSalesList });
});

// Start server
app.listen(port, () => {
    console.log("Server is running on port " + port);
});
