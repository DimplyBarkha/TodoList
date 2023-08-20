

function loginFrm(){

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

    fetch('http://todo-api.aavaz.biz/login', {
    method: 'POST',  
    headers: {
      "Content-Type": "application/json ",
      "Accept": "*/*"
    },
    body: JSON.stringify({ 
      email: email,
      password: password
    })
    }) .then(response => {

  if (response.headers.has('Authorization')) {
    alert("Login Successful!");
    var bearerToken = response.headers.get('Authorization');
    localStorage.setItem('token', bearerToken);
    window.open('todoList.html', '_self');
   
    console.log(localStorage.token)
  } else {
    console.log('Bearer Token not found in response header');
  }

 
  
})
.catch(error => {
  // Handle any errors that occurred during the request
  console.error('Error:', error);
});
var username = document.getElementById('email')
username.value='';
var password = document.getElementById('password')
password.value='';
 

}


function SubmitToDo(){

  var Title = document.getElementById('title').value;
  var desc = document.getElementById('description').value;
  var get_token = localStorage.getItem('token');

 console.log("receevw",get_token);
 if(Title==null || Title == ''||desc==null || desc ==''){
  alert('please fill both field first')
 }
 else{

  fetch('http://todo-api.aavaz.biz/todos', {
  method: 'POST',  
  headers: {
    "Content-Type": "application/json ",
    "Accept": "*/*",
    "Authorization": get_token
  },
    body: JSON.stringify({ 
      description: desc,
      done: true,
      labelColour:'BLUE',
      title:Title
    })
  }) .then(response => {
  console.log(response)
  GetTodoFunc(get_token);
  })
  .catch(error => {

    console.error('Error:', error);
  });}

 

}

function GetTodoFunc(token){

  var clearTit = document.getElementById('title');
  clearTit.value='';
  var ClearDes = document.getElementById('description');
  ClearDes.value = '';

  fetch('http://todo-api.aavaz.biz/todos', {
  method: 'GET',  
  headers: {
    "Content-Type": "application/json ",
  
    "Authorization": token
  }}) .then(response => {
    
    response.json().then(function(data) {
      var contentArray =[];
      contentArray = data.content;
      var listContainer = document.getElementById('row1');
      listContainer.innerHTML = '';
  
    contentArray.forEach(function(item) {
      var colDiv = document.createElement('div');
      colDiv.className = 'col-lg-12 col-md-12';

      var ul = document.createElement('ul');

      var listItem = document.createElement('li'); // Create an LI element
      listItem.className = 'task-list-item pd'; // Set the class name for the LI element
      
      var titleElement = document.createElement('label'); // Create an H4 element
      titleElement.className = 'task-list-item-label';
      titleElement.innerHTML = '<b>' + item.title +'<br>'; // Set the title within the H4 element

      var descriptionElement = document.createElement('p'); // Create a P element
      descriptionElement.textContent = item.description; // Set the description within the P element

      var spanElement = document.createElement('span');
      spanElement.style.position = 'absolute';
      spanElement.style.top = '23px';
      spanElement.style.right = '25px';
      spanElement.style.display = 'flex';
      spanElement.innerHTML = '<i style="font-size: 18px;color: #fff;cursor:pointer;" onclick="GotoSubItem('+item.todoId+')" class="fa-solid fa-plus"></i><i style="font-size: 18px;margin-left: 1rem;color:#fff;cursor:pointer;" onclick="deleteTodo('+item.todoId+')" class="fa-solid fa-trash"></i>'; // Set the content within the SPAN element

      listItem.appendChild(titleElement); // Append the H4 element to the LI element
      listItem.appendChild(descriptionElement); // Append the P element to the LI element
      listItem.appendChild(spanElement); // Append the SPAN element to the LI element
      ul.appendChild(listItem);

      colDiv.appendChild(ul);

      listContainer.appendChild(colDiv); 
    });
  })

    })
    .catch(error => {
      console.error('Error:', error);
    });

}
function GotoSubItem(todoId){
  console.log(todoId)
  localStorage.setItem('todoId',todoId)

  window.open('todoItem.html', '_self');


}


function AddSubItem(){

  var TodoId = localStorage.getItem('todoId');
  console.log(TodoId);
  var receivedData = localStorage.getItem('token');

  var ItemText = document.getElementById('SubItemText').value;

 console.log("receevw",receivedData);
 if(ItemText==null || ItemText == ''){
  alert('Please enter text')
 }
 else{
  fetch('http://todo-api.aavaz.biz/todos/'+TodoId+'/items', {
    method: 'POST',  
    headers: {
      "Content-Type": "application/json ",
      "Accept": "*/*",
      "Authorization": receivedData
    },
    body: JSON.stringify({ 
      itemText:ItemText
    })
  }) .then(response => {
  console.log(response)
  GetSubItem(receivedData);
  
     
      
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    });

 }
 

 

}
function GetSubItem(token){

  var TodoId = localStorage.getItem('todoId');
  var ItemText = document.getElementById('SubItemText');
  ItemText.value='';

  fetch('http://todo-api.aavaz.biz/todos/'+TodoId+'/items', {
    method: 'GET',  
    headers: {
      "Content-Type": "application/json ",
      "Accept": "*/*",
      "Authorization": token
    }}).then(response=>{
      response.json().then(function(data) {
        var itemArr = data.content;
        var ItemContainer = document.getElementById('itemList');
        ItemContainer.innerHTML = '';
        itemArr.forEach((itm,index)=>{
          var listItem = document.createElement('li');
          listItem.className = 'task-list-item pd';
          listItem.style.position='relative';

          listItem.innerHTML = '<b style="color:#fff;">' + (index+1 ) +  ' :- ' +  (itm.itemText) +' <br>';
       
          // listItem.textContent = index+1+  ':-' +  itm.itemText;
          var spanElement = document.createElement('span'); // Create a SPAN element
          spanElement.style.position = 'absolute';
          spanElement.style.top = '10px';
          spanElement.style.right = '10px';
          spanElement.innerHTML = '<i style="color:#fff;cursor:pointer;" class="fa-solid fa-pen-to-square"  data-toggle="modal" data-target="#exampleModal" onclick="setItemId('+itm.itemId+')"></i><i style="margin-left:0.5rem;color:#fff;cursor:pointer;" class="fa-solid fa-trash" onclick="deleteItmFunc('+itm.itemId+')" ></i>'
          listItem.appendChild(spanElement);
          ItemContainer.appendChild(listItem);
          
        })
      })

    })

}
function setItemId(itemId){
  localStorage.setItem('itemId',itemId);
  console.log(itemId)
}
function deleteItmFunc(itemId){
   var receivedData = localStorage.getItem('token');
console.log("receevw",receivedData);
  var todoId = localStorage.getItem('todoId');
  console.log(todoId,itemId);
  fetch('http://todo-api.aavaz.biz/todos/'+todoId+'/items/'+itemId+'', {
  method: 'DELETE', 
   headers: {
     "Accept": "*/*",
     "Authorization": receivedData
   }}).then(response=>{
     console.log(response)
     GetSubItem(receivedData)
     
     })

}
function saveEdit(){
   var itemId=localStorage.getItem('itemId')
   var ItemText = document.getElementById("NewText")
   var receivedData = localStorage.getItem('token');
console.log("receevw",receivedData);
  var todoId = localStorage.getItem('todoId');
  console.log(todoId,itemId);

  fetch('http://todo-api.aavaz.biz/todos/'+todoId+'/items/'+itemId+'', {
  method: 'PUT', 
   headers: {
     "Content-Type": "application/json",
     "Accept": "application/json ",
     "Authorization": receivedData,
     "Accept": "*/*"
   },body: JSON.stringify({ 
   itemText:ItemText
   })
}).then(response=>{
     alert('item sucessfully edited.')
     GetSubItem(receivedData);
     
     })

}

function LogOut(){
 
  var receivedData = localStorage.getItem('token');
  fetch('http://todo-api.aavaz.biz/log-out', {
    method: 'POST',  
    headers: {
      
      "Accept": "*/*",
      "Accept":" application/json",
      "Authorization": receivedData
    }
  }).then(resp=>{
    window.location.href='index.html'
   

  })
  var username = document.getElementById('email')
  username.value='';
  var password = document.getElementById('password')
  password.value='';

}

