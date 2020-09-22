{
    //method to submit the form data for a new post using AJAX
    let createPost = function(){
        let newPopstForm = $('#new-post-form');

        newPopstForm.submit(function(e){
            e.preventDEfault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPopstForm.serialize(),
                success: function(data){
                    console.log(data);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            }); //end of ajax
        }); //end of new form submit
    } //end of create function


    //method to create a post in DOM
}