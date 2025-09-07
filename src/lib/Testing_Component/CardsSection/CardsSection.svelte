<script lang="ts">
    export let icon = "/assets/default-icon.svg"; // Default icon
    export let title = "Default Title";
    export let description = "Default description here.";
    export let info = "Default info here.";
    export let category; // The category data passed from parent component
    export let showSubcategories; // Function passed from parent to handle category selection

    let showPopup = false;

    function togglePopup() {
        showPopup = !showPopup;
    }

    function handleClickOutside(event: MouseEvent) {
        if (
            showPopup &&
            !(event.target && (event.target as Element).closest(".popup")) &&
            !(event.target && (event.target as Element).closest(".info-button"))
        ) {
            showPopup = false;
        }
    }

    // Add/remove event listener when popup is shown/hidden
    $: if (showPopup) {
        window.addEventListener("mousedown", handleClickOutside);
    } else {
        window.removeEventListener("mousedown", handleClickOutside);
    }
</script>

<div class="card">
    <!-- on:click={() => showSubcategories(category)} -->
    <div class="card-body">
        <div class="card-icon">
            <img src={icon} alt={`${title} Icon`} />
        </div>
        <div class="card-text">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </div>

    <button
        type="button"
        class="info-button"
        aria-label="Show info"
        on:click={togglePopup}
    > Info
    </button>

    <!-- Popup info box -->
    {#if showPopup}
        <div class="popup">
            <div class="popup-content">
                <h4>What is {title} ?</h4>
                <p>{info}</p>
                <!-- <button on:click={togglePopup}>Close</button> -->
            </div>
        </div>
    {/if}

    <!-- Arrow link at the bottom-right -->
    <button class="btn" on:click={() => showSubcategories(category)}>></button>
</div>

<style>
    /* Individual Card */
    .card {
        position: relative;
        width: 450px;
        min-width: 450px;
        max-width: 450px;
        min-height: 240px;
        max-height: 240px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        padding: 36px 24px;
        margin: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            box-shadow 0.3s ease,
            transform 0.2s ease;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        overflow: hidden; /* Prevent content overflow */
    }

    /* Info button (upper right corner) */
.info-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(90deg, #1746a2 0%, #3066be 100%);
    color: #fff;
    font-size: 1rem;
    font-family: "Roboto", sans-serif;
    padding: 6px 18px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(23, 70, 162, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.info-button:hover {
    background: linear-gradient(90deg, #ffb347 0%, #ffd580 100%);
    color: #fff;
}

    /* Popup styles */
    .popup {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 400px;
        background-color: white;
        border-radius: 12px;
        padding: 15px;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 10;
        opacity: 0;
        transform: translateY(-10px);
        animation: fadeInPopup 0.3s ease-out forwards;
    }

    @keyframes fadeInPopup {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Popup content */
.popup-content h4 {
    font-family: "Alegreya", serif;
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #1746a2; /* Blue color for heading */
}

    .popup-content p {
        font-family: "Alegreya", serif;
        font-size: 0.95rem;
        color: #555;
    }

    /* Card Body */
    .card-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
        text-align: left;
        width: 100%;
        height: 100%;
        overflow: hidden; /* Prevent content overflow */
    }

    /* Icon inside the Card */
    .card-icon {
        width: 80px; /* Increased from 56px */
        height: 80px; /* Increased from 56px */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-icon img {
        width: 60px; /* Increased from 32px */
        height: 60px; /* Increased from 32px */
        object-fit: contain;
        display: block;
    }

    /* Card Text (Title and Description) */
    .card-text {
        width: 100%;
        text-align: left;
        flex: 1 1 auto;
        overflow: hidden;
    }

    .card-text h3 {
        font-family: "Roboto", serif;
        margin: 0;
        font-size: 1.2rem;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .card-text p {
    font-family: "Roboto", serif;
    font-size: 0.9rem;
    color: #777;
    padding-right: 60px; /* Add space for the button */
    word-break: break-word;
    white-space: normal;
    max-height: 3.6em; /* Limit to 2 lines */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.btn {
	background-color: #f1eded;
	border: 0;
	border-radius: 50px;
	/* box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2); */
	color: #000000;
	font-size: 16px;
	padding: 12px 25px;
	position: absolute;
	bottom: 20px;
	right: 12px;
	letter-spacing: 1px;
}
</style>
