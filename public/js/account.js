// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
  const pswdBtn = document.querySelector('#pswdBtn');
  
  if (pswdBtn) {
    pswdBtn.addEventListener('click', function() {
      const passwordInput = document.querySelector('#account_password');
      const type = passwordInput.getAttribute('type');
      
      if (type === 'password') {
        passwordInput.setAttribute('type', 'text');
        pswdBtn.textContent = 'Hide';
      } else {
        passwordInput.setAttribute('type', 'password');
        pswdBtn.textContent = 'Show';
      }
    });
  }
  
  //  Real-time password validation feedback
  const passwordField = document.querySelector('#account_password');
  if (passwordField) {
    passwordField.addEventListener('input', function() {
      const password = this.value;
      const requirements = document.querySelectorAll('.password-requirements-list li');
      
      if (requirements.length >= 4) {
        // Check length
        requirements[0].style.color = password.length >= 12 ? '#52c41a' : '#ff4d4f';
        
        // Check uppercase
        requirements[1].style.color = /[A-Z]/.test(password) ? '#52c41a' : '#ff4d4f';
        
        // Check number
        requirements[2].style.color = /\d/.test(password) ? '#52c41a' : '#ff4d4f';
        
        // Check special character
        requirements[3].style.color = /[^a-zA-Z0-9]/.test(password) ? '#52c41a' : '#ff4d4f';
      }
    });
  }
});