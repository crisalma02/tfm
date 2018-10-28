// tooltip y popover

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
	    })

$(function () {
    $('[data-toggle="popover"]').popover()
        });

// pintado verbos griego

function verbosgriego() {
	$('#verbo input[type=checkbox]').each(function () {
    	var colorMark;
        var allParas = document.getElementsByName(this.value);
        if (this.value == "aor" && this.checked) colorMark = "#fbfbba";
        else if (this.value == "pres" && this.checked) colorMark = "#c5e9fa";
        else if (this.value == "nopers" && this.checked) colorMark = " #cbf7a1";
        else {
        	colorMark = "none";
        }
        for (var i = 0; i < allParas.length; i++)
        	allParas[i].setAttribute("style", "background-color:" + colorMark + ";");
        });
    };

// pintado palabras latín

function palabraslatin() {
	$('#palabra input[type=checkbox]').each(function () {
    	var colorMark;
        	var allParas = document.getElementsByName(this.value);
        	if (this.value == "prep" && this.checked) colorMark = "#FAB4CF";
        	else if (this.value == "conj" && this.checked) colorMark = "#FAC870";
        	else if (this.value == "adv" && this.checked) colorMark = "#98B4FA";
        	else {
                colorMark = "none";
            }
            for (var i = 0; i < allParas.length; i++)
                allParas[i].setAttribute("style", "background-color:" + colorMark + ";");
        });
    };

// palabras legales en el select

$( document ).ready(function() {
  var select = document.getElementById('legal');
  select.addEventListener('change',
    function(){
      var selectedOption = this.options[select.selectedIndex];

      var modal = document.getElementById(selectedOption.value);
      modal.style.display = "block";

      var span = modal.getElementsByClassName("close")[0];
      
      span.onclick = function() {
          modal.style.display = "none";
      }
    });
});