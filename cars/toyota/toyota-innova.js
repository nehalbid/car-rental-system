// Image gallery functionality
function changeImage(src) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = src;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail-container img');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === src) {
            thumb.classList.add('active');
        }
    });
}

// Calculate total price based on selected dates
function calculateTotal() {
    const pickupDate = new Date(document.getElementById('pickup-date').value);
    const returnDate = new Date(document.getElementById('return-date').value);
    
    if (pickupDate && returnDate && returnDate >= pickupDate) {
        // Ensure at least one day is counted for same-day rentals
        const days = Math.max(1, Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)));
        const total = days * 2499; // Rs 2499 per day
        document.getElementById('totalPrice').textContent = `Rs ${total}`;
    } else {
        // Reset total price if dates are invalid
        document.getElementById('totalPrice').textContent = `Rs 0`;
    }
}

// Add event listeners to date inputs
document.getElementById('pickup-date').addEventListener('change', calculateTotal);
document.getElementById('return-date').addEventListener('change', calculateTotal);

// Set minimum date to today for both inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById('pickup-date').min = today;
document.getElementById('return-date').min = today;

// Handle rent now button click
function handleRentNow() {
    const pickupDate = document.getElementById('pickup-date').value;
    const returnDate = document.getElementById('return-date').value;
    
    if (!pickupDate || !returnDate) {
        alert('Please select both pickup and return dates');
        return;
    }
    
    if (new Date(returnDate) < new Date(pickupDate)) {
        alert('Return date must be after pickup date');
        return;
    }
    
    // Calculate total price based on selected dates
    const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * 2499;
    
    // Redirect to the rental form page with query parameters
    const car = "Toyota Innova"; // Car name or model
    const bookingUrl = `../../booking/rentalform.html?car=${encodeURIComponent(car)}&pickupDate=${encodeURIComponent(pickupDate)}&returnDate=${encodeURIComponent(returnDate)}&totalPrice=${encodeURIComponent('Rs ' + totalPrice)}`;
    window.location.href = bookingUrl;
}
