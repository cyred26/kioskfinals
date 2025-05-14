document.addEventListener('DOMContentLoaded', function() {

    const startBtn = document.getElementById("start-order-btn");
    const welcomeScreen = document.getElementById("welcome-screen");
    const orderTypeScreen = document.getElementById("order-type-screen");
    const dineInBtn = document.getElementById("dine-in-btn");
    const takeOutBtn = document.getElementById("take-out-btn");
    const menuScreen = document.getElementById("menu-screen");
    const sideNav = document.querySelector(".side-navigation");
    const sideBar = document.querySelector(".sidebar");
    const modal = document.getElementById("item-modal");
    const modalImg = document.getElementById("modal-item-img");
    const modalName = document.getElementById("modal-item-name");
    const modalPrice = document.getElementById("modal-item-price");
    const closeModal = document.querySelector(".close-modal");
    const itemQtyInput = document.getElementById("item-qty-input"); 
    const addToCartModal = document.getElementById("add-to-cart-modal");
    const sizeOptions = document.getElementById("size-options");
    const cartCount = document.querySelector(".cart-icon span");
    const orderContainer = document.querySelector(".order-items");
    const totalDisplay = document.querySelector(".cart-total");
    const allCards = document.querySelectorAll(".card");
    

    let selectedItem = null;
    let currentQty = 1;
    let cartItems = [];
    let totalAmount = 0;
    let orderType = "";

    // welcome screen
    startBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        orderTypeScreen.style.display = 'flex';
    });

    //order type
    dineInBtn.addEventListener('click', function() {
        orderType = "Dine In";
        orderTypeScreen.style.display = 'none';
        menuScreen.style.display = 'block';
    });

    takeOutBtn.addEventListener('click', function() {
        orderType = "Take Out";
        orderTypeScreen.style.display = 'none';
        menuScreen.style.display = 'block';
    });

// adons
    const itemCustomizations = {
        "VarleyWich": {
            sizes: [
                { name: "Regular", price: 0 },
                { name: "Large", price: 10 }
            ],
            addOns: [
                { name: "Extra Cheese", price: 15 },
                { name: "Special Sauce", price: 10 }
            ]
        },
        "Varleyzza": {
            sizes: [
                { name: "Regular", price: 0 },
                { name: "Large", price: 15 }
            ],
            addOns: [
                { name: "Pepperoni", price: 20 },
                { name: "Extra Cheese", price: 15 },
                { name: "Mushroom", price: 10 }
            ]
        },
        "VarleyDog": {
            sizes: [
                { name: "Regular", price: 0 },
                { name: "Jumbo", price: 10 }
            ],
            addOns: [
                { name: "Extra Cheese", price: 10 },
                { name: "Chili Sauce", price: 5 }
            ]
        },

        "VarleyCola": {
            sizes: [
                { name: "Regular", price: 0 },
                { name: "Large", price: 5 }
            ],
            addOns: [
                { name: "Extra Ice", price: 0 }
            ]
        },
        "VarleyZest": {
            sizes: [
                { name: "Regular", price: 0 },
                { name: "Large", price: 5 }
            ],
            addOns: [
                { name: "Extra Ice", price: 0 }
            ]
        }

    };

//for items modal
    function openItemModal(card) {
        const name = card.querySelector(".card--title").textContent.trim();
        const price = card.querySelector(".price").textContent.trim();
        const img = card.querySelector("img").src;


        currentQty = 1;
        itemQtyInput.value = currentQty;

        modalName.textContent = name;
        modalPrice.textContent = price;
        modalImg.src = img;


        const customization = itemCustomizations[name];
        

        const sizeOptionsContainer = document.getElementById("size-options");
        if (customization && customization.sizes) {
            sizeOptionsContainer.innerHTML = `<h4>Select Size</h4>` + 
                customization.sizes.map((size, index) => `
                    <div class="size-option">
                        <input type="radio" id="size-${size.name.toLowerCase()}" 
                               name="size" 
                               value="${size.name}" 
                               ${index === 0 ? 'checked' : ''}>
                        <label for="size-${size.name.toLowerCase()}">
                            ${size.name} ${size.price > 0 ? `(+₱${size.price.toFixed(2)})` : ''}
                        </label>
                    </div>
                `).join('');
            sizeOptionsContainer.classList.add('show');
        } else {
            sizeOptionsContainer.classList.remove('show');
        }


        const addOnsContainer = document.querySelector(".add-ons");
        if (customization && customization.addOns) {
            addOnsContainer.innerHTML = `<h4>Add-ons</h4>` + 
                customization.addOns.map(addon => `
                    <div class="add-on-option">
                        <input type="checkbox" 
                               id="add-${addon.name.toLowerCase().replace(/\s+/g, '-')}" 
                               name="add-on" 
                               value="${addon.name}">
                        <label for="add-${addon.name.toLowerCase().replace(/\s+/g, '-')}">
                            ${addon.name} ${addon.price > 0 ? `(+₱${addon.price.toFixed(2)})` : ''}
                        </label>
                    </div>
                `).join('');
        }


        modal.style.display = "block";
    }


    allCards.forEach(card => {
        card.addEventListener("click", function(e) {
 
            if (!e.target.classList.contains('add-to-cart')) {
                openItemModal(this);
            }
        });
        
    
        const cardPrice = card.querySelector(".card--price");
        if (!cardPrice.querySelector(".add-to-cart")) {
            const addToCartBtn = document.createElement("i");
            addToCartBtn.className = "fa-solid fa-plus add-to-cart";
            addToCartBtn.addEventListener("click", function(e) {
                e.stopPropagation(); 
                openItemModal(card);
            });
            cardPrice.appendChild(addToCartBtn);
        }
    });


    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    itemQtyInput.addEventListener('change', function() {

        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            value = 1;
            this.value = value;
        }
        currentQty = value;
    });


    addToCartModal.onclick = function() {
        const name = modalName.textContent.trim();
        const basePrice = parseFloat(modalPrice.textContent.replace("₱", ""));
        

        currentQty = parseInt(itemQtyInput.value);
        if (isNaN(currentQty) || currentQty < 1) {
            currentQty = 1;
            itemQtyInput.value = 1;
        }
        

        let totalPrice = basePrice;
        const customization = itemCustomizations[name];
        

        if (customization && customization.sizes) {
            const selectedSize = document.querySelector('input[name="size"]:checked');
            const sizePrice = customization.sizes.find(s => s.name === selectedSize.value)?.price || 0;
            totalPrice += sizePrice;
        }


        let addOnsText = "";
        if (customization && customization.addOns) {
            const selectedAddOns = document.querySelectorAll('input[name="add-on"]:checked');
            selectedAddOns.forEach(addon => {
                const addOnPrice = customization.addOns.find(a => a.name === addon.value)?.price || 0;
                totalPrice += addOnPrice;
                addOnsText += ` + ${addon.value}`;
            });
        }


        const cartItem = {
            name: name + (addOnsText ? addOnsText : ''),
            price: totalPrice,
            qty: currentQty
        };


        //cart function
        let found = cartItems.find(item => item.name === cartItem.name);
        if (found) {
            found.qty += currentQty;
        } else {
            cartItems.push(cartItem);
        }

        totalAmount += totalPrice * currentQty;
        updateCart();


        modal.style.display = "none";
    }


    function updateCart() {

        orderContainer.innerHTML = '';
        

        if (cartItems.length === 0) {
            orderContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.forEach((item, index) => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('order-item');
                cartItemElement.innerHTML = `
                    <span>${item.name} x${item.qty}</span>
                    <span>₱${(item.price * item.qty).toFixed(2)}</span>
                    <button class="remove-btn" data-index="${index}">-</button>
                `;
                orderContainer.appendChild(cartItemElement);
            });


            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    const item = cartItems[index];
                    totalAmount -= item.price * item.qty;
                    cartItems.splice(index, 1);
                    updateCart();
                });
            });
        }

     
        totalDisplay.textContent = `₱${totalAmount.toFixed(2)}`;

    
        cartCount.textContent = cartItems.reduce((total, item) => total + item.qty, 0);
    }

    //for siodebar
    document.getElementById('toggle-nav').addEventListener('click', function() {
        sideNav.style.left = sideNav.style.left === '0px' ? '-250px' : '0px';
    });
    document.querySelector('.close-nav-btn').addEventListener('click', function() {
        sideNav.style.left = '-250px';
    });
    document.getElementById('toggle-cart').addEventListener('click', function() {
        sideBar.style.right = sideBar.style.right === '0px' ? '-300px' : '0px';
    });
    document.querySelector('.close-cart-btn').addEventListener('click', function() {
        sideBar.style.right = '-300px';
    });

   
    const categoryItems = document.querySelectorAll('.category-item, .side-nav-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
        
            categoryItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');

        
            allCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category').split(' ');
                card.style.display = (category === 'all' || cardCategories.includes(category)) ? 'flex' : 'none';
            });
        });
    });

    // checkout function
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        if (cartItems.length === 0) {
            alert('Please select your orders first');
            return;
        }

        //receipt random order number
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const orderNumber = "VC" + Math.floor(100000 + Math.random() * 900000);
        const date = new Date().toLocaleString();
        
        //quue number
        const waitNumber = Math.floor(1 + Math.random() * 99);

        const receiptWindow = window.open('', '', 'width=400,height=600');
        if (!receiptWindow) {
            alert("Popup blocked! Please allow popups for this site.");
            return;
        }

        //new window for receipt to be easily separated
        receiptWindow.document.write(`
            <html>
            <head>
                <title>Receipt - VARLEYCIOUS!</title>
                <style>
                    body { font-family: 'Poppins', sans-serif; padding: 20px; background: #FFF8E1; }
                    .receipt-container { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .receipt-header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
                    .receipt-header h2 { color: #4E342E; margin: 0 0 5px; }
                    .order-number, .order-date { font-size: 14px; color: #6D5550; }
                    .wait-number { font-size: 28px; color: #4E342E; font-weight: bold; text-align: center; margin: 15px 0; padding: 10px; background: #FFF8E1; border-radius: 5px; }
                    .order-type { font-weight: bold; margin: 15px 0; }
                    .item-row, .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .total-row { border-top: 1px solid #ddd; padding-top: 10px; font-weight: bold; font-size: 18px; }
                    .print-btn { margin-top: 20px; background: #6D5550; color: white; border: none; padding: 10px; border-radius: 5px; width: 100%; font-size: 16px; }
                    .print-btn:hover { background: #4E342E; }
                    .close-btn { margin-top: 10px; background: #4E342E; color: white; border: none; padding: 10px; border-radius: 5px; width: 100%; font-size: 16px; }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="receipt-header">
                        <h2>VARLEYCIOUS!</h2>
                        <div class="order-number">Order #${orderNumber}</div>
                        <div class="order-date">${date}</div>
                    </div>
                    <div class="wait-number">Queue Number #${waitNumber}</div>
                    <div class="order-type">Order Type: ${orderType}</div>
                    <div class="payment-method-info">Payment Method: ${payment}</div>
        `);

        cartItems.forEach(item => {
            receiptWindow.document.write(`
                <div class="item-row">
                    <div>${item.name} x${item.qty}</div>
                    <div>₱${(item.qty * item.price).toFixed(2)}</div>
                </div>
            `);
        });

        receiptWindow.document.write(`
                    <div class="total-row">
                        <div>Total:</div>
                        <div>₱${totalAmount.toFixed(2)}</div>
                    </div>
                    <button class="print-btn" onclick="window.print()">Print Receipt</button>
                    <button class="close-btn" onclick="window.close(); opener.location.reload();">Close Receipt</button>
                </div>
            </body>
            </html>
        `);
        
        receiptWindow.document.close();
        
        // to revert back to welcome screen after clicking print
        receiptWindow.onbeforeunload = function() {
         
            setTimeout(function() {
                window.location.reload();
            }, 500);
        };

        cartItems = [];
        totalAmount = 0;
        updateCart();
    });

    //for search input
    document.querySelector(".search--box input").addEventListener("input", function () {
        const value = this.value.toLowerCase();
        allCards.forEach(card => {
            const name = card.querySelector(".card--title").textContent.toLowerCase();
            card.style.display = name.includes(value) ? "flex" : "none";
        });
    });

    updateCart();
});

window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 380);
});

function togglePayment() {
    const el = document.getElementById('paymentOptions');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}