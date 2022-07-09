function unique_selection(changed_id){
  console.log(changed_id)
  if(changed_id == 'Player1'){
    let p1 = document.getElementById('Player1').value
    console.log(p1)
    document.querySelectorAll("#Player2 option").forEach(opt => {
      if (opt.disabled == true){
	//if already disabled, do nothing
      } else if (opt.value == p1) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player3 option").forEach(opt => {
      if (opt.disabled == true){
        //if already disabled, do nothing
      } else if (opt.value == p1) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player4 option").forEach(opt => {
      if (opt.disabled == true){
        //if already disabled, do nothing
      } else if (opt.value == p1) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  } 
  if(changed_id == 'Player2'){
    let p2 = document.getElementById('Player2').value
    console.log(p2)
    document.querySelectorAll("#Player1 option").forEach(opt => {
      if (opt.disabled == true){
        //if already disabled, do nothing
      } else if (opt.value == p2) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player3 option").forEach(opt => {
      if (opt.disabled == true){
        //if already disabled, do nothing
      } else if (opt.value == p2) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
    document.querySelectorAll("#Player4 option").forEach(opt => {
      if (opt.disabled == true){
        //if already disabled, do nothing
      } else if (opt.value == p2) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  }
};
