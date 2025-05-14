const API_BASE = 'https://t-j-pork.onrender.com';

function loginAdmin() {
  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  // Simple hardcoded check
  const validUsername = "admin";
  const validPassword = "admin123";

  if (username === validUsername && password === validPassword) {
    localStorage.setItem("isAdminLoggedIn", "true");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Incorrect username or password.");
  }
}


async function loadPorkTypes() {
  const response = await fetch(`${API_BASE}/pork-types`);
  const porkTypes = await response.json();
  const select = document.getElementById('porkType');
  if (select) {
    // Clear current options
    select.innerHTML = '<option value="">Select pork type</option>';
    
    // Add each pork type as an option
    porkTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;  // The pork type itself as the value
      option.innerText = type;  // Display name
      select.appendChild(option);
    });
  }



  const list = document.getElementById('porkTypeList');
  if (list) {
    list.innerHTML = '';
    porkTypes.forEach((type, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${type} <button onclick="deletePorkType(${index})">Delete</button>`;
      list.appendChild(li);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPorkTypes();
  displayOrders();
});

document.getElementById('orderForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const porkType = document.getElementById('porkType').value;
  const packs = parseInt(document.getElementById('packs').value);
  const price = packs * 300;

  if (!porkType) return alert('Please select a type of pork.');

  // ✅ FIX: Use correct field names for backend
  const order = {
    name: `${name} ${surname}`,
    address: email,
    phone,
    type: porkType,
    quantity: packs
  };

  try {
    const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });


    if (response.ok) {
      alert(`Thank you ${name}! Your order for ${packs} pack(s) of ${porkType} has been placed.`);
      document.getElementById('orderForm').reset();
    } else {
      const err = await response.json();
      alert('An error occurred while placing your order: ' + (err.error || 'Unknown error'));
    }
  } catch (error) {
    alert('Failed to connect to the server.');
    console.error(error);
  }
});

async function displayOrders() {
  const tableBody = document.getElementById('orderRecords');
  if (!tableBody) return;

  const response = await fetch(`${API_BASE}/api/orders`);
  const orders = await response.json();

  tableBody.innerHTML = '';
  let total = 0;

  orders.forEach(order => {
    const orderPrice = order.quantity * 300;
    total += orderPrice;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.name}</td>
      <td>${order.phone}</td>
      <td>${order.type}</td>
      <td>${order.quantity}</td>
      <td>R${orderPrice}</td>
      <td><button onclick="deleteOrder(${order.id})">Mark as Delivered</button></td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById('totalPrice').innerText = 'Total: R' + total.toFixed(2);
}

async function deleteOrder(id) {
  if (confirm("Are you sure the order was delivered?")) {
    await fetch(`${API_BASE}/api/orders/${id}`, { method: 'DELETE' });
    displayOrders();
  }
}

async function addPorkType() {
  const newType = document.getElementById('newPorkType').value.trim();
  if (!newType) return alert("Enter a pork type");

  await fetch(`${API_BASE}/pork-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: newType })
  });

  document.getElementById('newPorkType').value = '';
  loadPorkTypes();
}

async function deletePorkType(index) {
  await fetch(`${API_BASE}/pork-types/${index}`, { method: 'DELETE' });
  loadPorkTypes();
}
