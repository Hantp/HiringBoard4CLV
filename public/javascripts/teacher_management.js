$(function(){
    $("#teacher-management-addbtn").on('click', function(event){
        event.preventDefault();
        var student_ids = $("#teacher-add-student-selector").val();
    
        if(student_ids && student_ids.length > 0) {
            $.ajax({
                url: "/teacher/management",
                method: "POST",
                data: { student_ids: student_ids }
            }).done(function( data ) {
                if ( data.status == "success" ) {
                    window.location = "/teacher/management";  
                }
            });
        }
    })

    $(".removebtn").on('click', function(event){
        event.preventDefault();
        var curItem = $(this);
        var id = $(this).attr("title");
        
        $.ajax({
            url: "/teacher/management",
            method: "PUT",
            data: { delete_id: id }
        }).done(function( data ) {
            if(data.status == 'success') {
                $('#teacher_questions_table').DataTable().row(curItem.parents().parents()).remove().draw();
            }
        });
    })
});
