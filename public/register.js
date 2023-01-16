function checkpassword(){
    let password = document.getElementById("password").value;
    let cfrmPassword = document.getElementById("confirm-password").value;
    console.log(password,cfrmPassword);
    if (password.length != 0)
    {
        if (password!=cfrmPassword){
            alert("Passwords does not match");
            document.getElementById("confirm-password").focus();
            return false;
        }  

    }
}