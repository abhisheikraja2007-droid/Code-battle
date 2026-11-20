document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('contestForm');
    const successMessage = document.getElementById('successMessage');
    const userEmail = document.getElementById('userEmail');
    const submitAnotherBtn = document.getElementById('submitAnother');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            message: 'Please enter your full name (at least 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        language: {
            required: true,
            message: 'Please select a programming language'
        },
        experience: {
            required: true,
            message: 'Please select your experience level'
        }
    };

    // Show error message for a field
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Add error class to the input
            const input = document.getElementById(fieldId);
            if (input) {
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
            }
        }
    }

    // Clear error for a field
    function clearError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            
            // Remove error class from the input
            const input = document.getElementById(fieldId);
            if (input) {
                input.classList.remove('error');
                input.removeAttribute('aria-invalid');
            }
        }
    }

    // Validate a single field
    function validateField(field) {
        const fieldId = field.id || field.name;
        const value = field.type === 'radio' ? 
            document.querySelector(`input[name="${field.name}"]:checked`)?.value : 
            field.value.trim();
        
        const rules = validationRules[field.name];
        if (!rules) return true;
        
        // Check required field
        if (rules.required && !value) {
            showError(fieldId, rules.message || 'This field is required');
            return false;
        }
        
        // Check min length
        if (rules.minLength && value.length < rules.minLength) {
            showError(fieldId, rules.message || `Must be at least ${rules.minLength} characters`);
            return false;
        }
        
        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showError(fieldId, rules.message || 'Invalid format');
            return false;
        }
        
        clearError(fieldId);
        return true;
    }

    // Validate entire form
    function validateForm(event) {
        if (event) event.preventDefault();
        
        let isValid = true;
        const formElements = form.elements;
        
        // Validate each form field
        for (let i = 0; i < formElements.length; i++) {
            const field = formElements[i];
            if (field.name && validationRules[field.name]) {
                if (!validateField(field)) {
                    isValid = false;
                }
            }
        }
        
        if (isValid) {
            submitForm();
        } else {
            // Focus on first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                const fieldId = firstError.id.replace('Error', '');
                const input = document.getElementById(fieldId);
                if (input) {
                    input.focus();
                }
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return false;
    }
    
    // Handle form submission
    async function submitForm() {
        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.setAttribute('aria-busy', 'true');
        
        try {
            // Simulate API call (replace with actual fetch/axios call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // In a real app, you would send the data to your server here
            console.log('Form data:', data);
            
            // Show success message
            userEmail.textContent = data.email;
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Reset form for better UX
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting the form. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.setAttribute('aria-busy', 'false');
            submitBtn.innerHTML = originalBtnText;
        }
    }
    
    // Event Listeners
    form.addEventListener('submit', validateForm);
    
    // Real-time validation on blur
    form.addEventListener('blur', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            validateField(e.target);
        }
    }, true);
    
    // Clear errors on input
    form.addEventListener('input', function(e) {
        if (e.target.name && validationRules[e.target.name]) {
            clearError(e.target.id || e.target.name);
        }
    });
    
    // Handle radio button validation
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            clearError('experience');
        });
    });
    
    // Handle "Submit Another" button
    submitAnotherBtn.addEventListener('click', function() {
        successMessage.style.display = 'none';
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        
        // Focus on first input for better accessibility
        const firstInput = form.querySelector('input, select');
        if (firstInput) firstInput.focus();
    });
    
    // Accessibility: Handle keyboard navigation
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const formElements = Array.from(form.elements);
            const currentIndex = formElements.indexOf(e.target);
            
            if (currentIndex < formElements.length - 1) {
                formElements[currentIndex + 1].focus();
            }
        }
    });
    
    // Initialize form with some basic accessibility
    document.querySelectorAll('input, select').forEach(input => {
        if (input.required) {
            input.setAttribute('aria-required', 'true');
        }
    });
});
