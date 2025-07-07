import ToDoList from "/js/todolist.js";
import ToDoItem from "/js/todoitem.js";

const toDoList = new ToDoList();

//launch app
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        initApp();
    }
});



const initApp = () => {
    //add listeners
    const itemEntryForm = document.getElementById('newItemForm');
    itemEntryForm.addEventListener('submit', (e) => {
       e.preventDefault();
       processSubmission();
    });
    const clearItems = document.getElementById('clearItems');
    clearItems.addEventListener('click', () => {
        const list = toDoList.getList();
        if (list.length){
            const confirmed = confirm("Are you sure you want to delete the entire list?");
            if (confirmed){
                toDoList.clearList();
                updatePersistentData(toDoList.getList());
                refreshThePage();
            }
        }
    })
    //procedural things
    //load list object
    loadListObject();
    refreshThePage();
}

const loadListObject = () => {
    const storedList = localStorage.getItem('myToDoList');
    if (typeof storedList !== 'string'){
        return;
    }

    const parseList = JSON.parse(storedList);
    parseList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    });

}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById('listItems');
    deleteContents(parentElement);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList();
    list.forEach((item) => {
        buildListItem(item);
    });
}

const buildListItem = (item) => {
    const div = document.createElement('div');
    div.className = "item";
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.id = item.getId();
    check.tabIndex = 0;
    //add a click listener to checkbox
    addClickListenerToCheckbox(check);
    const  label = document.createElement('label');
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById('listItems');
    container.appendChild(div);

}
const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener('click', () => {
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getList())
        setTimeout(()=>{
            refreshThePage();
        }, 1000);

    })
}

const updatePersistentData = (listArray) => {
    localStorage.setItem('myToDoList', JSON.stringify(listArray));
}

const clearItemEntryField = () => {
    document.getElementById('newItem').value = '';
}

const setFocusOnItemEntry = () => {
    document.getElementById('newItem').focus();
}

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if (!newEntryText.length) {
        return;
    }
    const nextItemId = calcNextItemId();

    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    updatePersistentData(toDoList.getList())
    refreshThePage();
}

const getNewEntry = () => {
    return document.getElementById('newItem').value.trim();
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0){
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;

}

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);

    return toDo;
}