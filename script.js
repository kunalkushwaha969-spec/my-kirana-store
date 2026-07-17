document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("part-request-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Stops the page from reloading

        // 1. Get the exact details the customer typed into the form
        const customerName = document.getElementById("name").value;
        const customerPhone = document.getElementById("phone").value;
        const requestedPart = document.getElementById("part").value;

        // 2. PUT YOUR WHATSAPP NUMBER HERE FOR THE DEMO
        // Replace '919876543210' with your actual 10-digit WhatsApp number. 
        // Keep the '91' at the start (Country Code for India), but do NOT use a '+' or spaces.
        const demoWhatsAppNumber = "919453209505"; 

        // 3. Format the message cleanly with line breaks (%0A) and bold text (*)
        const message = `Hello Ramnagar Spares!%0A%0A*New Demo Order*%0A*Name:* ${customerName}%0A*Phone:* ${customerPhone}%0A*Part Needed:* ${requestedPart}`;

        // 4. Create the official WhatsApp API link
        const whatsappURL = `https://wa.me/${demoWhatsAppNumber}?text=${message}`;

        // 5. Open WhatsApp in a new tab (works seamlessly on phone apps or WhatsApp Web)
        window.open(whatsappURL, "_blank");

        // 6. Clear the form fields so it's ready for the next test
        form.reset(); 
    });
});