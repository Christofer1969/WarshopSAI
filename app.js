
const API_KEY = 'AIzaSyBmlguu6AYBkupXgClW2GxPswC-MWktl_A';
const SPREADSHEET_ID = '1ZkP_jYm9ia3DBaVmE1oQoKRTjgUFTqzQwnf6uMtuToQ';
const RANGE = 'dataproduk!A2:W'; 

async function login() {
    const email = document.getElementById('email').value;
    const messageElement = document.getElementById('message');

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();

        const rows = data.values;
        const userRows = rows.filter(row => row[6] === email);

        if (userRows.length > 0) {
            const user = userRows[0]; 
            messageElement.textContent = 'Login successful!';
            messageElement.style.color = 'green';

            const products = userRows.map(row => {
                return {
                    product: row[1],
                    imageLink: row[15],
                    visible: row[10],
                    rowId: row[0],
                    imageback : row[16]
                };
            }).filter(product => product.visible === '');

            localStorage.setItem('user', JSON.stringify({
                rowID : user[0],
                email: user[6],
                name: user[1],
                products: products,

            }));

            window.location.href = 'Front.html';
        } else {
            messageElement.textContent = 'Email not found.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        messageElement.textContent = 'An error occurred. Please try again.';
        messageElement.style.color = 'red';
    }
}