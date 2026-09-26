/* ============================================================
   North Star Bakery - script.js
   Touchstone 4: Interactivity and Client-Side Data

   Features:
     1. Pre-Order Planner on products.html
     2. localStorage persistence of the selected products
     3. Contact form field-level validation
     4. Saved selections prefill the contact form order details
   ============================================================ */

(function () {
    "use strict";

    /* --------------------------------------------------------
       Data: PRODUCTS array + STORAGE_KEYS object
       -------------------------------------------------------- */
    const PRODUCTS = [
        { id: "sourdough",     name: "Sourdough Loaf",    category: "Breads" },
        { id: "multigrain",    name: "Multigrain Boule",  category: "Breads" },
        { id: "baguette",      name: "Country Baguette",  category: "Breads" },
        { id: "croissant",     name: "Butter Croissant",  category: "Pastries" },
        { id: "cinnamon-roll", name: "Cinnamon Roll",     category: "Pastries" },
        { id: "muffin",        name: "Blueberry Muffin",  category: "Pastries" },
        { id: "layer-cake",    name: "Classic Layer Cake", category: "Cakes" },
        { id: "birthday-cake", name: "Birthday Cake",     category: "Cakes" },
        { id: "cupcakes",      name: "Cupcakes",          category: "Cakes" },
        { id: "signature-loaf", name: "Signature Loaf",   category: "House Favorites" }
    ];

    const STORAGE_KEYS = {
        selectedProducts: "northStarSelectedProducts"
    };

    const VALID_PRODUCT_IDS = PRODUCTS.map(function (product) {
        return product.id;
    });

    let selectedProductIds = [];

    /* --------------------------------------------------------
       Shared helpers
       -------------------------------------------------------- */
    function getPlannerElement() {
        return document.getElementById("planner-list");
    }

    function getPlannerStatusElement() {
        return document.getElementById("planner-status");
    }

    function getPlannerCountElement() {
        return document.getElementById("planner-count");
    }

    function findProductById(productId) {
        return PRODUCTS.find(function (product) {
            return product.id === productId;
        });
    }

    function announcePlannerStatus(message) {
        const statusElement = getPlannerStatusElement();
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    function formatCountText(count) {
        if (count === 1) {
            return "1 item selected";
        }
        return count + " items selected";
    }

    /* --------------------------------------------------------
       localStorage: reading and saving the selection
       -------------------------------------------------------- */
    function readStoredIds() {
        let storedIds = [];
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.selectedProducts);
            const parsed = raw ? JSON.parse(raw) : [];
            if (Array.isArray(parsed)) {
                storedIds = parsed;
            }
        } catch (error) {
            storedIds = [];
        }
        return storedIds.filter(function (id, index, list) {
            return VALID_PRODUCT_IDS.indexOf(id) !== -1
                && list.indexOf(id) === index;
        });
    }

    function saveSelectedItems() {
        try {
            localStorage.setItem(
                STORAGE_KEYS.selectedProducts,
                JSON.stringify(selectedProductIds)
            );
        } catch (error) {
            /* Storage unavailable: the page still works for this visit. */
        }
    }

    /* --------------------------------------------------------
       Pre-Order Planner: loading and rendering
       -------------------------------------------------------- */
    function loadSelectedItems() {
        selectedProductIds = readStoredIds();
    }

    function renderSelectedItems() {
        const listElement = getPlannerElement();
        const countElement = getPlannerCountElement();
        const buttons = document.querySelectorAll("[data-product-id]");
        if (!listElement || !countElement) {
            return;
        }

        listElement.textContent = "";

        selectedProductIds.forEach(function (productId) {
            const product = findProductById(productId);
            if (!product) {
                return;
            }
            const item = document.createElement("li");
            item.className = "planner-item";

            const name = document.createElement("span");
            name.className = "planner-item-name";
            name.textContent = product.name;
            item.appendChild(name);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-button";
            removeButton.textContent = "Remove";
            removeButton.setAttribute(
                "aria-label",
                "Remove " + product.name + " from your pre-order list"
            );
            removeButton.addEventListener("click", function () {
                removeSelectedItem(product.id);
            });
            item.appendChild(removeButton);

            listElement.appendChild(item);
        });

        countElement.textContent = formatCountText(selectedProductIds.length);

        buttons.forEach(function (button) {
            const isSelected =
                selectedProductIds.indexOf(button.dataset.productId) !== -1;
            button.classList.toggle("selected", isSelected);
            button.setAttribute("aria-pressed", isSelected ? "true" : "false");
        });
    }

    /* --------------------------------------------------------
       Pre-Order Planner: actions
       -------------------------------------------------------- */
    function addSelectedItem(productId) {
        const product = findProductById(productId);
        if (!product) {
            return;
        }
        if (selectedProductIds.indexOf(productId) !== -1) {
            announcePlannerStatus(
                product.name + " is already in your pre-order list."
            );
            return;
        }
        selectedProductIds.push(productId);
        saveSelectedItems();
        renderSelectedItems();
        announcePlannerStatus(
            product.name + " was added to your pre-order list."
        );
    }

    function removeSelectedItem(productId) {
        const product = findProductById(productId);
        const position = selectedProductIds.indexOf(productId);
        if (position === -1) {
            return;
        }
        selectedProductIds.splice(position, 1);
        saveSelectedItems();
        renderSelectedItems();
        announcePlannerStatus(
            (product ? product.name : "The item")
            + " was removed from your pre-order list."
        );
    }

    function clearSelectedItems() {
        if (selectedProductIds.length === 0) {
            announcePlannerStatus("Your pre-order list is already empty.");
            return;
        }
        selectedProductIds = [];
        saveSelectedItems();
        renderSelectedItems();
        announcePlannerStatus("Your pre-order list has been cleared.");
    }

    /* --------------------------------------------------------
       Pre-Order Planner: initialization
       -------------------------------------------------------- */
    function initPreOrderPlanner() {
        const listElement = getPlannerElement();
        if (!listElement) {
            return;
        }

        loadSelectedItems();

        const addButtons = document.querySelectorAll("[data-product-id]");
        addButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                addSelectedItem(button.dataset.productId);
            });
        });

        const clearButton = document.getElementById("clear-planner");
        if (clearButton) {
            clearButton.addEventListener("click", clearSelectedItems);
        }

        renderSelectedItems();

        if (selectedProductIds.length > 0) {
            announcePlannerStatus(
                "Your saved pre-order list has been restored."
            );
        }
    }

    /* --------------------------------------------------------
       Contact form: prefill from saved selections and draft
       -------------------------------------------------------- */
    function getFormElement() {
        return document.getElementById("inquiry-form");
    }

    function getFormStatusElement() {
        return document.getElementById("form-status");
    }

    function announceFormStatus(message, type) {
        const statusElement = getFormStatusElement();
        if (!statusElement) {
            return;
        }
        statusElement.textContent = message;
        statusElement.className = "form-status " + (type || "");
    }

    function getSavedProductNames() {
        return readStoredIds()
            .map(function (productId) {
                const product = findProductById(productId);
                return product ? product.name : null;
            })
            .filter(function (name) {
                return name !== null;
            });
    }

    function restoreOrderDetails() {
        const form = getFormElement();
        if (!form) {
            return;
        }

        const names = getSavedProductNames();
        const detailsField = document.getElementById("order-details");
        const requestTypeField = document.getElementById("request-type");

        if (names.length > 0 && detailsField
            && detailsField.value.trim() === "") {
            detailsField.value = names.join(", ");
            announceFormStatus(
                "Your saved pre-order items were added to the form.",
                "info"
            );
            if (requestTypeField && requestTypeField.value === "") {
                requestTypeField.value = "pre-order";
            }
        }
    }

    /* --------------------------------------------------------
       Contact form: validation helpers
       -------------------------------------------------------- */
    function getErrorElement(fieldId) {
        return document.getElementById(fieldId + "-error");
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = getErrorElement(fieldId);
        if (!field || !errorElement) {
            return;
        }
        field.classList.add("invalid");
        field.setAttribute("aria-invalid", "true");
        errorElement.textContent = message;
    }

    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = getErrorElement(fieldId);
        if (!field || !errorElement) {
            return;
        }
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function isValidEmail(value) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value);
    }

    function getTodayString() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return today.getFullYear() + "-" + month + "-" + day;
    }

    /* --------------------------------------------------------
       Contact form: individual checks
       -------------------------------------------------------- */
    function validateName() {
        const field = document.getElementById("full-name");
        if (!field) {
            return true;
        }
        const value = field.value.trim();
        if (value === "" || value.length < 2) {
            showFieldError("full-name",
                "Please enter your name using at least 2 characters.");
            return false;
        }
        clearFieldError("full-name");
        return true;
    }

    function validateEmail() {
        const field = document.getElementById("email");
        if (!field) {
            return true;
        }
        const value = field.value.trim();
        if (value === "") {
            showFieldError("email", "Please enter your email address.");
            return false;
        }
        if (!isValidEmail(value)) {
            showFieldError("email", "Please enter a valid email address.");
            return false;
        }
        clearFieldError("email");
        return true;
    }

    function validateRequestType() {
        const field = document.getElementById("request-type");
        if (!field) {
            return true;
        }
        if (field.value === "") {
            showFieldError("request-type",
                "Please choose a type of request.");
            return false;
        }
        clearFieldError("request-type");
        return true;
    }

    function validatePickupDate() {
        const field = document.getElementById("pickup-date");
        const requestTypeField = document.getElementById("request-type");
        if (!field || !requestTypeField) {
            return true;
        }
        if (requestTypeField.value !== "pre-order") {
            clearFieldError("pickup-date");
            return true;
        }
        if (field.value === "") {
            showFieldError("pickup-date",
                "Please choose a pickup date for your pre-order.");
            return false;
        }
        if (field.value < getTodayString()) {
            showFieldError("pickup-date",
                "Please choose today or a future pickup date.");
            return false;
        }
        clearFieldError("pickup-date");
        return true;
    }

    function validateOrderDetails() {
        const field = document.getElementById("order-details");
        if (!field) {
            return true;
        }
        const value = field.value.trim();
        if (value === "") {
            showFieldError("order-details",
                "Please describe the item or items you want to pre-order.");
            return false;
        }
        if (value.length < 10) {
            showFieldError("order-details",
                "Please describe the item or items you want to pre-order "
                + "using at least 10 characters.");
            return false;
        }
        clearFieldError("order-details");
        return true;
    }

    /* --------------------------------------------------------
       Contact form: submit handling
       -------------------------------------------------------- */
    function validateForm() {
        const checks = [
            validateName(),
            validateEmail(),
            validateRequestType(),
            validatePickupDate(),
            validateOrderDetails()
        ];
        return checks.every(function (passed) {
            return passed === true;
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        announceFormStatus("", "");
        if (!validateForm()) {
            announceFormStatus(
                "Please correct the highlighted fields and try again.",
                "error"
            );
            const firstInvalid = document.querySelector(
                "#inquiry-form .invalid"
            );
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }
        announceFormStatus(
            "Thank you! Your request is ready. This demonstration website "
            + "does not send data to a live bakery server.",
            "success"
        );
    }

    function bindValidationEvents() {
        const form = getFormElement();
        if (!form) {
            return;
        }
        const fields = ["full-name", "email", "request-type",
            "pickup-date", "order-details"];
        fields.forEach(function (fieldId) {
            const field = document.getElementById(fieldId);
            if (!field) {
                return;
            }
            const validator = {
                "full-name": validateName,
                "email": validateEmail,
                "request-type": validateRequestType,
                "pickup-date": validatePickupDate,
                "order-details": validateOrderDetails
            }[fieldId];
            field.addEventListener("blur", function () {
                validator();
            });
            field.addEventListener("input", function () {
                if (field.classList.contains("invalid")) {
                    validator();
                }
            });
            field.addEventListener("change", function () {
                if (field.id === "request-type") {
                    clearFieldError("pickup-date");
                }
            });
        });
        form.addEventListener("submit", handleFormSubmit);
    }

    function initContactForm() {
        const form = getFormElement();
        if (!form) {
            return;
        }
        bindValidationEvents();
    }

    /* --------------------------------------------------------
       Boot: defensive per-page initialization
       -------------------------------------------------------- */
    function init() {
        initPreOrderPlanner();
        initContactForm();
        restoreOrderDetails();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
