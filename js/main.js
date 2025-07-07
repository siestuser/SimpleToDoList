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

    //procedural things
    //load list object
    refreshThePage();
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
        console.log(child);
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
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = item.getId();
    checkbox.tabIndex = 0;
    //add a click listener to checkbox
    addClickListenerToCheckbox(checkbox);
    const  label = document.createElement('label');
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(checkbox);
    div.appendChild(label);
    const container = document.getElementById('listItems');
    container.appendChild(div);

}
const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener('click', () => {
        toDoList.removeItemFromList(checkbox.id);
        //TODO:remove from persistent data
        setTimeout(()=>{
            refreshThePage();
        }, 1000);

    })
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
    //TODO: update persistent data;
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
    } else{
        return nextItemId;
    }
}

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);

    return toDo;
}