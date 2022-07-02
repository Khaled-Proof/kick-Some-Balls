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
