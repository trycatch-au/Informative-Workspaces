/*global jQuery */

function rotateClassesGroup (objects) {
    for (var i = 0; i < objects.length; i++) { // loop through all objects
        if ($(objects[i]).hasClass('active')) { // if the current loop object is active
            $('div.rotate_navigation span.environment_rotate').removeClass('active');
            $(objects[i]).removeClass('active').hide('fast'); // hide the current item
            var next = ((i+1) >= objects.length) ? 0 : (i+1);
            $(objects[next]).addClass('active').show('slow'); // show the next one
            $('div.rotate_navigation span.environment_rotate.rotate_count_' + next).addClass('active');
            return;
        }
    }
}; 

