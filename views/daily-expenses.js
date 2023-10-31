const token = localStorage.getItem('token');

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}


window.addEventListener("DOMContentLoaded", () => {
   const decodedToken = parseJwt(token);
   const ispremiumuser = decodedToken.ispremiumuser;
   
   if(ispremiumuser)showPremiumUser();
   
    const amount = document.getElementById('amount');
    const description = document.getElementById('description');
    const field = document.getElementById('field');
    const addbutton = document.getElementById('addbutton');
    addbutton.addEventListener('click', (event)=>{
    event.preventDefault();
    const amountValue = amount.value;
    const descriptionValue = description.value;
    const fieldValue = field.value;  
    const obj = {amount: amountValue, description: descriptionValue, field:fieldValue};
      
      axios
           .post("http://localhost:3000/expense/addExpense", obj, {headers:{"Authorization": token}})
           .then((response)=>{
    
            if(response.status === 200){
              showExpensesOnScreen(obj);
            }
          
           })
           .catch((err)=>{
                    console.log("Error Saving to database", err);
           })
    })


    //fetching and displaying expenses when the page loads 
    axios
      .get("http://localhost:3000/expense/getExpenses",{headers: {"Authorization": token}})
      .then((res) => {
        res.data.expenses.forEach(expense => {
          //limit, query
          showExpensesOnScreen(expense);
          
        });

      })
      .catch((err) => {
       
      });
  });




  function showExpensesOnScreen(obj){

    const table = document.getElementById("table")
    const row = document.createElement('tr');          

    const amountData = document.createElement('td');    
    amountData.textContent = `${obj.amount}`;
    row.appendChild(amountData);

    const descriptionData = document.createElement('td');    
    descriptionData.textContent = `${obj.description}`;
    row.appendChild(descriptionData);

    const fieldData = document.createElement('td');    
    fieldData.textContent = `${obj.field}`;
    row.appendChild(fieldData);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";

    deleteButton.onclick = () => {
    const confirmDelete = confirm("Are you sure you want to delete this expense?")
    if(!confirmDelete) return;
    axios
    .delete(`http://localhost:3000/expense/deleteExpense/${obj.id}`, {headers: {"Authorization": token}})
    .then(() => {
     table.removeChild(row);
      console.log("Expense deleted successfully");
    })
    .catch((err) => {
      console.log("There is an error deleting expense", err);
    });
};

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    table.appendChild(row);
    document.getElementById("form").reset();
}



// handling eventlistener on premium button
  document.getElementById('premiumbutton').onclick = async function(e){
    e.preventDefault();

    try{
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization": token}})
    console.log("Response>>>>>>>>",response,response.data.orderid, response.data.key_id); //response will contain orderid

    var options = {
      "key": response.data.key_id, 
      "order_id": response.data.orderid, //for one time payment
      // a handler function to handle the success payment
      "handler": async function(response){
          try{
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus',
            {order_id: options.order_id, payment_id: response.razorpay_payment_id,},
            {headers: {"Authorization": token} });

            alert('You are a premium user now');
           // localStorage.setItem('token', response.data.token); //payment token
            showPremiumUser();

            }catch(err){
              console.log(err);
            }
           
            //showLeaderboard();
        } 

      }

      const rzp1 = new Razorpay(options);
      rzp1.open(); 
      rzp1.on("payment.failed", function (response) {
        console.log(response)
        alert("Payment Failed!")
    });
  } catch (err) {
    console.error(err);
  }
  }


  function showPremiumUser(){
    const premiumButton = document.getElementById('premiumbutton');
    premiumButton.style.display = 'none';
    const leaderboardBtn = document.getElementById('leaderboardbtn');
    leaderboardBtn.style.display = 'inline-block';
    document.getElementById('premiumuser').innerHTML = 'Premium Member';

    leaderboardBtn.onclick = async()=>{
      try{
      const leaderboardArray = await axios.get('http://localhost:3000/premium/showLeaderboard', { headers: { "Authorization": token } })

        for(let i=0; i<leaderboardArray.data.length; i++){
          let obj = leaderboardArray.data[i];
          const table = document.getElementById("leaderboardtable")
          const row = document.createElement('tr');          
      
          const rankData = document.createElement('td');    
          rankData.textContent = `${i+1}`;
          row.appendChild(rankData);
      
          const totalData = document.createElement('td');    
          totalData.textContent = `${obj.total??0}`;
          row.appendChild(totalData);
      
          const nameData = document.createElement('td');    
          nameData.textContent = `${obj.name}`;
          row.appendChild(nameData);
  
          table.appendChild(row);
        }
       }catch(err){
      console.log('Error fetching Leaderboard', err);
      }
  
     }
  }
    

  document.getElementById('downloadBtn').addEventListener('click', function download(){

    axios.get('http://localhost:3000/expense/download', {headers: {"Authorization": token}})
          .then((response)=>{
            console.log("RESPONSE", response)
            if(response.status === 200){
              //backend is sending a download link which on click opens new tab in browser and file starts downloading
              const a = document.createElement('a');
              a.href = response.data.fileUrl
              a.download = `${response.data.filename}`;  //this will instruct browser to download the file named myexpense.csv
              a.click();
            }else{
             console.log("Error downloading expense file, no response")
            }
          })
  })

  









































 