window['simple-box-id'] = 0;

document.addEventListener('DOMContentLoaded', function() {
   simpleBoxInit();
});

// You can call this to initialize and simple-boxes.
// This is useful if selects are added after the DOM is loaded.
function simpleBoxInit() {
   var simpleBoxSelects = document.querySelectorAll('.simple-box');
   // Every simple-box gets a unique id.
   for (var index = 0; index < simpleBoxSelects.length; index++) {
      var simpleBoxSelect = simpleBoxSelects[index];
      var id = window['simple-box-id'] + index;

      var container = document.createElement('div');
      container.id = 'simple-box-container-' + id;
      container.className = 'simple-box-container';
      // We need to add a tab index so it can be focused.
      container.setAttribute('tabindex', '-1');
      // Close the dropdown on blur.
      container.addEventListener('blur', simpleBoxDeactivateDropDown.bind(container, id));

      var containerHtml = "<input class='simple-box-input'" +
                                 " type='text' id='simple-box-input-" + id + "' " +
                                 " data-simple-box-id='" + id + "' />" +
                           "<button class='simple-box-button' id='simple-box-button-" +
                                 id + "' onclick='simpleBoxToggleDropDown(" + id + ");'>" +
                                 "<div class='simple-box-arrow'></div></button>" +
                           "<div class='simple-box-dropdown' id='simple-box-dropdown-" + id + "'>";

      // We expect all the children of the select to be options.
      containerHtml += "<p data-simple-box-value='' onclick=\"simpleBoxSelectValue(" +
                       id + ", '', '');\">--CLEAR--</p>";
      for (var i = 0; i < simpleBoxSelect.children.length; i++) {
         containerHtml += "<p onclick=\"simpleBoxSelectValue(" + id + ", '" +
                          simpleBoxSelect.children[i].value + "', '" +
                          simpleBoxSelect.children[i].text + "');\">" +
                          simpleBoxSelect.children[i].text + "</p>";
      }

      containerHtml += "</div>";
      container.innerHTML = containerHtml;

      var newSimpleBoxSelect = simpleBoxSelect.parentElement.replaceChild(container, simpleBoxSelect);
      // Remove the simple-box class so we will not try to modify it again.
      newSimpleBoxSelect.className = newSimpleBoxSelect.className.replace(/\bsimple-box\b/, '');
      // We cannot change the id of the select, because the user may want to listen on the it, so
      //  we can give it a unique class.
      newSimpleBoxSelect.classList.add('simple-box-select-' + id);
      newSimpleBoxSelect.classList.add('simple-box-select');
      newSimpleBoxSelect.setAttribute('data-simple-box-id', id);

      newSimpleBoxSelect.addEventListener('change', function() {
         var selectId = this.getAttribute('data-simple-box-id');
         var text = this.querySelector("option[value='" + this.value + "']").textContent;
         simpleBoxSelectValue(selectId, this.value, text);
      });

      container.appendChild(newSimpleBoxSelect);
   }
   window['simple-box-id'] += simpleBoxSelects.length;

   // On change, add the value to the select to make it a valid value.
   var inputs = document.getElementsByClassName('simple-box-input');
   for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', function() {
         var newOption = document.createElement('option');
         newOption.setAttribute('value', this.value);
         newOption.innerHTML = this.value;

         // TODO(eriq): I don't like this risky class tactic.
         var simpleBoxSelect = document.getElementsByClassName('simple-box-select-' + this.getAttribute('data-simple-box-id'))[0];
         simpleBoxSelect.appendChild(newOption);
         simpleBoxSelect.value = this.value;
      });
   }
}

function simpleBoxToggleDropDown(id) {
   var box = document.getElementById('simple-box-dropdown-' + id);

   if (box.className.match(/simple-box-dropdown-active/)) {
      box.className = box.className.replace(/simple-box-dropdown-active/, '');
   } else {
      box.classList.add('simple-box-dropdown-active');
      box.focus();
   }
}

function simpleBoxActivateDropDown(id) {
   var box = document.getElementById('simple-box-dropdown-' + id);
   box.classList.add('simple-box-dropdown-active');
   box.focus();
}

function simpleBoxDeactivateDropDown(id) {
   var box = document.getElementById('simple-box-dropdown-' + id);
   box.className = box.className.replace(/simple-box-dropdown-active/, '');
}

// Never add values to the dropdown, but add new values to the select.
function simpleBoxSelectValue(id, val, text) {
   simpleBoxDeactivateDropDown(id);

   var select = document.getElementsByClassName('simple-box-select-' + id)[0];
   select.value = val;

   var inputBox = document.getElementById('simple-box-input-' + id);
   if (val == '') {
      inputBox.value = '';
   } else {
      inputBox.value = text;
   }
}
