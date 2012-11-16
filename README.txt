simple-box
==========

A simple ComboBox.

Usage
-----

You can see sample.html for sample usage.
All you need to do is add 'simple-box' to your selects class.

   <label>Do You Like simple-box?</label>
   <select class='simple-box'>
      <option value="yes">YES</option>
      <option value="no">NO</option>
   </select>

The underlying select will be hidden, but will will be updated with
the new values. Therefore, you can still rely on the 'change' event
coming from it.
