const itemInput = document.getElementById('item');
const dateInput = document.getElementById('date');
const priority = document.getElementById('priority');
const addItem = document.getElementById('add');
const todayItems = document.getElementById('today-items');
const futureItems = document.getElementById('future-items');
const completedItems = document.getElementById('completed-items');

let items = JSON.parse(localStorage.getItem('todoList')) || [];

addItem.addEventListener('click', (e) => {
    e.preventDefault();
    if (itemInput.value && dateInput.value && priority.value) {
        const currDate = new Date();
        const date = new Date(dateInput.value); // Fix: Use new Date() to parse the date correctly
        const data = { id: items.length + 1, name: itemInput.value, date: date.toISOString(), priority: priority.value, completed: false }; // Store ISO string for date
        if (currDate.getFullYear() >= date.getFullYear() && currDate.getDate() > date.getDate()) {
            alert('You cannot enter past dates');
            return false;
        }
        items.push(data);
        itemInput.value = '';
        dateInput.value = '';
        localStorage.setItem('todoList', JSON.stringify(items));
        renderItem();
    } else {
        alert('You cannot leave empty fields');
    }
});

function renderItem() {
    items = JSON.parse(localStorage.getItem('todoList')) || [];
    futureItems.innerHTML = '';
    todayItems.innerHTML = '';
    completedItems.innerHTML = '';
    const currDate = new Date();

    // Make three arrays and filter data
    const completedList = items.filter(item => item.completed);

    // Use .getTime() for full date comparison
    const todayList = items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getDate() === currDate.getDate() &&
            itemDate.getMonth() === currDate.getMonth() &&
            itemDate.getFullYear() === currDate.getFullYear() &&
            !item.completed;
    });

    const futureList = items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate > currDate && !item.completed;
    });

    // Now call the render helper function to render each one of them
    render(todayList, todayItems);
    render(futureList, futureItems);
    render(completedList, completedItems);
}

renderItem();

function render(list, div) {
    list.forEach((data, index) => {
        const date = new Date(data.date);
        if (div == completedItems) {
            div.innerHTML += `
            <div class="item">
                <p>${index + 1}. ${data.name}</p>
                <p>${date.toLocaleDateString()}</p>
                <p>${data.priority}</p>
                <div class="icons">
                    <i class="fa-solid fa-trash" onclick='handleDelete(${data.id})'></i>
                </div>
            </div>
        `;
        }else{
            div.innerHTML += `
            <div class="item">
                <p>${index + 1}. ${data.name}</p>
                <p>${date.toLocaleDateString()}</p>
                <p>${data.priority}</p>
                <div class="icons">
                    <i class="fa-solid fa-circle-check" onclick='handleComplete(${data.id})'></i>
                    <i class="fa-solid fa-trash" onclick='handleDelete(${data.id})'></i>
                </div>
            </div>
        `;
        }
    });
}

function handleComplete(id) {
    console.log(items)
    items.forEach(item => {
        if (id == item.id) {
            item.completed = true;
        }
    });
    localStorage.setItem('todoList', JSON.stringify(items));
    renderItem();
}

function handleDelete(id) {
    items = items.filter(item => {
        return id != item.id;
    });
    localStorage.setItem('todoList', JSON.stringify(items));
    renderItem();
}
