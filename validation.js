$(document).ready(function() {
    const $form = $('#registrationForm');
    const $username = $('#username');
    const $email = $('#email');
    const $password = $('#password');
    const $confirmPassword = $('#confirmPassword');
    const $passwordStrength = $('#passwordStrength');

    $form.on('submit', function(e) {
        e.preventDefault();
        validateForm();
    });

    $username.on('input', debounce(() => validateField($username, validateUsername)));
    $email.on('input', debounce(() => validateField($email, validateEmail)));
    $password.on('input', debounce(() => {
        validateField($password, validatePassword);
        validateField($confirmPassword, validateConfirmPassword);
        updatePasswordStrength($password.val());
    }));
    $confirmPassword.on('input', debounce(() => validateField($confirmPassword, validateConfirmPassword)));

    function validateForm() {
        validateField($username, validateUsername);
        validateField($email, validateEmail);
        validateField($password, validatePassword);
        validateField($confirmPassword, validateConfirmPassword);

        if ($('.error:not(:empty)').length === 0) {
            alert('Form submitted successfully!');
            $form[0].reset();
            $passwordStrength.hide();
        }
    }

    function validateField($field, validationFunc) {
        const $errorElement = $(`#${$field.attr('id')}Error`);
        const errorMessage = validationFunc($field.val());
        $errorElement.text(errorMessage);
        $field.toggleClass('is-invalid', !!errorMessage);
        $field.toggleClass('is-valid', !errorMessage);
    }

    function validateUsername(value) {
        if (value.trim() === '') return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters long';
        return '';
    }

    function validateEmail(value) {
        if (value.trim() === '') return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email address';
        return '';
    }

    function validatePassword(value) {
        if (value === '') return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        return '';
    }

    function validateConfirmPassword(value) {
        if (value === '') return 'Please confirm your password';
        if (value !== $password.val()) return 'Passwords do not match';
        return '';
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function updatePasswordStrength(password) {
        const strength = calculatePasswordStrength(password);
        const strengthText = getStrengthText(strength);
        const strengthClass = getStrengthClass(strength);

        $passwordStrength.text(strengthText).attr('class', strengthClass);
        $passwordStrength.toggle(!!password);
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]+/.test(password)) strength++;
        if (/[A-Z]+/.test(password)) strength++;
        if (/[0-9]+/.test(password)) strength++;
        if (/[$@#&!]+/.test(password)) strength++;
        return strength;
    }

    function getStrengthText(strength) {
        if (strength < 2) return 'Weak';
        if (strength < 4) return 'Moderate';
        return 'Strong';
    }

    function getStrengthClass(strength) {
        if (strength < 2) return 'alert alert-danger';
        if (strength < 4) return 'alert alert-warning';
        return 'alert alert-success';
    }

    function debounce(func, delay = 300) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), delay);
        };
    }
});
