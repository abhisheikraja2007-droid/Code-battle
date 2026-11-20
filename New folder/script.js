document.addEventListener("DOMContentLoaded", () => {

    // ===== Cached DOM Elements =====
    const form = document.getElementById("contestForm");
    const successMessage = document.getElementById("successMessage");
    const userEmail = document.getElementById("userEmail");
    const submitAnotherBtn = document.getElementById("submitAnother");
    const submitBtn = form.querySelector('button[type="submit"]');

    // ===== Validation Rules =====
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            message: "Please enter your full name (at least 2 characters)"
        },
        class: {
            required: true,
            minLength: 1,
            message: "Class cannot be empty"
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address"
        },
        language: {
            required: true,
            message: "Please select a programming language"
        },
        experience: {
            required: true,
            message: "Please select your experience level"
        }
    };

    // ===== Utility: Sanitize Display Text =====
    const sanitizeText = str =>
        String(str).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

    // ===== Show Error =====
    function showError(fieldName, message) {
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = "block";
            errorEl.setAttribute("aria-hidden", "false");
        }

        if (fieldName === "experience") {
            document.querySelectorAll('input[name="experience"]').forEach(el => {
                el.classList.add("error");
                el.setAttribute("aria-invalid", "true");
            });
        } else {
            const input = document.getElementById(fieldName);
            if (input) {
                input.classList.add("error");
                input.setAttribute("aria-invalid", "true");
            }
        }
    }

    // ===== Clear Error =====
    function clearError(fieldName) {
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.style.display = "none";
            errorEl.setAttribute("aria-hidden", "true");
        }

        if (fieldName === "experience") {
            document.querySelectorAll('input[name="experience"]').forEach(el => {
                el.classList.remove("error");
                el.removeAttribute("aria-invalid");
            });
        } else {
            const input = document.getElementById(fieldName);
            if (input) {
                input.classList.remove("error");
                input.removeAttribute("aria-invalid");
            }
        }
    }

    // ===== Validate Single Field =====
    function validateField(field) {
        const name = field.name;
        const rules = validationRules[name];
        if (!rules) return true;

        let value =
            field.type === "radio"
                ? document.querySelector(`input[name="${name}"]:checked`)?.value
                : field.value.trim();

        // Special normalization for email
        if (name === "email") value = value.toLowerCase();

        // Required
        if (rules.required && !value) {
            showError(name, rules.message);
            return false;
        }

        // Min Length
        if (rules.minLength && value.length < rules.minLength) {
            showError(name, rules.message);
            return false;
        }

        // Regex Pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showError(name, rules.message);
            return false;
        }

        clearError(name);
        return true;
    }

    // ===== Validate Whole Form =====
    function validateForm(e) {
        if (e) e.preventDefault();

        const fields = [...form.elements].filter(el => el.name && validationRules[el.name]);
        let valid = true;

        fields.forEach(field => {
            if (!validateField(field)) valid = false;
        });

        if (valid) {
            submitForm();
        } else {
            const firstError = document.querySelector(".error-message:not(:empty)");
            if (firstError) {
                const fieldName = firstError.id.replace("Error", "");
                const el =
                    fieldName === "experience"
                        ? document.querySelector('input[name="experience"]')
                        : document.getElementById(fieldName);

                if (el) el.focus();
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    // ===== Submit Form Simulated API =====
    async function submitForm() {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";
        submitBtn.setAttribute("aria-busy", "true");

        try {
            await new Promise(res => setTimeout(res, 1000)); // Simulated delay

            const data = Object.fromEntries(new FormData(form).entries());
            userEmail.innerHTML = sanitizeText(data.email);
            console.log("Submitted Data:", data);

            form.style.display = "none";
            successMessage.style.display = "block";
            successMessage.scrollIntoView({ behavior: "smooth" });

            form.reset();
            Object.keys(validationRules).forEach(clearError);

        } catch {
            alert("An error occurred. Please try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.removeAttribute("aria-busy");
        }
    }

    // ===== Enter Key Navigation =====
    form.addEventListener("keydown", e => {
        if (e.key === "Enter" && e.target.type !== "textarea") {
            e.preventDefault();
            const focusable = [...form.querySelectorAll("input, select, textarea, button")].filter(
                el => !el.disabled && el.offsetParent !== null
            );
            const index = focusable.indexOf(e.target);

            if (index < focusable.length - 1) {
                focusable[index + 1].focus();
            } else {
                validateForm(new Event("submit"));
            }
        }
    });

    // ===== Real-Time Validation =====
    form.addEventListener(
        "input",
        e => {
            if (validationRules[e.target.name]) {
                clearError(e.target.name);
            }
        },
        true
    );

    // ===== On Blur Validation =====
    form.addEventListener(
        "blur",
        e => {
            if (validationRules[e.target.name]) validateField(e.target);
        },
        true
    );

    // ===== Submit Listener =====
    form.addEventListener("submit", validateForm);

    // ===== Submit Another =====
    submitAnotherBtn.addEventListener("click", () => {
        successMessage.style.display = "none";
        form.style.display = "block";
        form.querySelector("input").focus();
    });
});
