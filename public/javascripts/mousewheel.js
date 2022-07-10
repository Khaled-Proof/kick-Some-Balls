$(function() {
  $("#team1").bind("mousewheel", function(event, delta) {
    if (delta > 0) {
      if (parseInt(this.value) < 8) {
        this.value = parseInt(this.value) + 1;
      }
    } else {
      if (parseInt(this.value) > 0) {
        this.value = parseInt(this.value) - 1;
      }
    }
    return false;
  });
});
	
$(function() {
  $("#team2").bind("mousewheel", function(event, delta) {
    if (delta > 0) {
      if (parseInt(this.value) < 8) {
        this.value = parseInt(this.value) + 1;
      }
    } else {
      if (parseInt(this.value) > 0) {
        this.value = parseInt(this.value) - 1;
      }
    }
    return false;
  });
});

window.onload = function(){
  var validate_team1 = document.getElementById('team1');
  validate_team1.onkeydown = checkInput;
  validate_team1.onpaste = checkInput;
  var validate_team2 = document.getElementById('team2');
  validate_team2.onkeydown = checkInput;
  validate_team2.onpaste = checkInput;

}

function checkInput(e){
  var key = window.e ? event.keyCode : event.which;
    if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39){
      return true;
    }
    else if (key < 48 || key > 56) {
      return false;
    }
    else return true;
};
