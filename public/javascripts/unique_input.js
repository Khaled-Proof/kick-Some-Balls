function unique_selection(changed_id){
  console.log(changed_id)
  if(changed_id == 'Player1'){
    let p1 = document.getElementById('Player1').value
    let p2 = document.getElementById('Player2').value
    let p3 = document.getElementById('Player3').value
    let p4 = document.getElementById('Player4').value
    console.log(p1)
    document.querySelectorAll("#Player2 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p3 || opt.value == p4){
	//if already disabled, do nothing
      } else if (opt.value == p1) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player3 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p2 || opt.value == p4){
        //if already disabled, do nothing
      } else if (opt.value == p1) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player4 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p2 || opt.value == p3){
        //if already disabled, do nothing
      } else if (opt.value == p1) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  } 
  if(changed_id == 'Player2'){
    let p1 = document.getElementById('Player1').value
    let p2 = document.getElementById('Player2').value
    let p3 = document.getElementById('Player3').value
    let p4 = document.getElementById('Player4').value
    console.log(p2)
    document.querySelectorAll("#Player1 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p3 || opt.value == p4){
        //if already disabled, do nothing
      } else if (opt.value == p2) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player3 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p1 || opt.value == p4){
        //if already disabled, do nothing
      } else if (opt.value == p2) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player4 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p1 || opt.value == p3){
        //if already disabled, do nothing
      } else if (opt.value == p2) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  }
  if(changed_id == 'Player3'){
    let p1 = document.getElementById('Player1').value
    let p2 = document.getElementById('Player2').value
    let p3 = document.getElementById('Player3').value
    let p4 = document.getElementById('Player4').value
    console.log(p3)
    document.querySelectorAll("#Player1 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p2 || opt.value == p4){
        //if already disabled, do nothing
      } else if (opt.value == p3) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player2 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p1 || opt.value == p4){
        //if already disabled, do nothing
      } else if (opt.value == p3) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player4 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p1 || opt.value == p2){
        //if already disabled, do nothing
      } else if (opt.value == p3) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  }
  if(changed_id == 'Player4'){
    let p1 = document.getElementById('Player1').value
    let p2 = document.getElementById('Player2').value
    let p3 = document.getElementById('Player3').value
    let p4 = document.getElementById('Player4').value
    console.log(p4)
    document.querySelectorAll("#Player1 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p2 || opt.value == p3){
        //if already disabled, do nothing
      } else if (opt.value == p4) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player2 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p1 || opt.value == p3){
        //if already disabled, do nothing
      } else if (opt.value == p4) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player3 option").forEach(opt => {
      if (opt.disabled == true && opt.value == p1 || opt.value == p2){
        //if already disabled, do nothing
      } else if (opt.value == p4) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  }
};
