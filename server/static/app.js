function getBedroomsValue() {
    var uiBedrooms = document.getElementsByName("uiBedrooms");
    for (var i in uiBedrooms) {
        if (uiBedrooms[i].checked) {
            return parseInt(i)+1;
        }
    }
    return -1; // Invalid value
}

function onClickedEstimatePrice() {
    console.log("Estimate Price button clicked.");
    
    // Show loading state
    const loading = document.getElementById("loading");
    const estPrice = document.getElementById("uiEstimatedPrice");
    
    loading.classList.add("show");
    estPrice.classList.remove("show");
    
    var bedrooms = getBedroomsValue();
    var region = document.getElementById("uiRegions");

    // Validate inputs
    if (bedrooms === -1) {
        showError("Please select number of bedrooms");
        return;
    }
    
    if (!region.value) {
        showError("Please select a region");
        return;
    }

    var url = "http://127.0.0.1:5000/predict_home_price";

    $.post(url, {
        bedrooms: bedrooms,
        region: region.value
    }, function(data, status) {
        console.log(data.estimated_price);
        let price = data.estimated_price;
        let formattedPrice = price.toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        // Hide loading and show result
        loading.classList.remove("show");
        estPrice.innerHTML = `
            <h2>${formattedPrice}</h2>
            <p>Estimated price for ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''} in ${region.value}</p>
        `;
        estPrice.classList.add("show");
        
        console.log(status);
    }).fail(function(xhr, status, error) {
        // Handle error
        console.error("Error:", error);
        showError("Unable to calculate estimate. Please try again.");
    });
}

function showError(message) {
    const loading = document.getElementById("loading");
    const estPrice = document.getElementById("uiEstimatedPrice");
    
    loading.classList.remove("show");
    estPrice.innerHTML = `
        <h2 style="color: #ef4444; font-size: 1.2rem;">Error</h2>
        <p>${message}</p>
    `;
    estPrice.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
    estPrice.classList.add("show");
    
    // Reset background after 3 seconds
    setTimeout(() => {
        estPrice.style.background = "linear-gradient(135deg, var(--accent-color), var(--accent-hover))";
    }, 3000);
}

function onPageLoad() {
    console.log("document loaded");
    var url = "http://127.0.0.1:5000/get_region_names";
    
    $.get(url, function(data, status) {
        console.log("got response for get_region_names request");
        if(data && data.regions) {
            var regions = data.regions;
            var uiRegions = document.getElementById("uiRegions");
            
            // Clear existing options and add default
            $('#uiRegions').empty();
            $('#uiRegions').append('<option value="" disabled selected>Choose a region</option>');
            
            // Add all regions from API
            for (var i in regions) {
                var opt = new Option(regions[i]);
                $('#uiRegions').append(opt);
            }
        }
    }).fail(function(xhr, status, error) {
        console.error("Failed to load regions:", error);
        // Keep the default options if API fails
    });
}

// Enhanced keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard support for bedroom selection
    const bedroomInputs = document.querySelectorAll('input[name="uiBedrooms"]');
    bedroomInputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && index > 0) {
                bedroomInputs[index - 1].focus();
                bedroomInputs[index - 1].checked = true;
            } else if (e.key === 'ArrowRight' && index < bedroomInputs.length - 1) {
                bedroomInputs[index + 1].focus();
                bedroomInputs[index + 1].checked = true;
            }
        });
    });
    
    // Add Enter key support for estimate button
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement !== document.querySelector('.estimate-button')) {
            onClickedEstimatePrice();
        }
    });
});

window.onload = onPageLoad;