<script lang='ts'>

  import { goto } from '$app/navigation';
  import { Toaster, toast } from "svelte-sonner";
  // Receive the entire test object
  import { user, isAuthenticated } from "$lib/store";
  import { get } from "svelte/store";
  import { writable } from "svelte/store";

  interface Test {
    id: number;
    test_name: string;
    image_url: string;
    test_description: string;
    test_price: number;
  }

  export let test: Test;
  
  // Fallback to individual props if needed
  export let icon = test?.image_url || "/assets/default-icon.svg";
  export let title = test?.test_name || "Default Title";
  export let description = test?.test_description || "Default description";
  export let info = test ? `Price: ₹${test.test_price}` : "Default info";
  export let price = "$0.00";

  let showPopup = false;
  
  function togglePopup() {
    showPopup = !showPopup;
  }


</script>

<Toaster richColors />


  <div class="course">
    <div class="course-preview">
        <span class="highlight-text top-label">Test</span>
        <h4>{title}</h4>
        <a href="#" on:click={() => goto(`/tests/${test.id}`)}>View all details</a>
    </div>
    <div class="course-info">
        <span class="highlight-text top-label">Description</span>
        <p class="truncate-multi">{description}</p>
        <button class="btn" on:click={togglePopup}>Continue</button>
    </div>
</div>



<style>
  .highlight-text {
    background: #e3eafe;
    color: #1746a2;
    border-radius: 100px;
    padding: 2px 10px;
    font-size: 0.9rem;
    font-weight: 100;
    margin-right: 6px;
    margin-bottom: 4px;
    display: inline-block;
}

.highlight-text.top-label {
    position: absolute;
    top: 18px;
    left: 30px;
    z-index: 2;
    margin-bottom: 0;
}


.course {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  max-width: 100%;
  margin: 20px;
  overflow: hidden;
  width: 500px;      /* Fixed width */
  height: 220px;     /* Fixed height */
  min-width: 500px;  /* Prevent shrinking */
  min-height: 220px; /* Prevent shrinking */
}

.course-preview {
  background-color: #1746a2;
  color: #fff;
  padding: 18px;
  max-width: 180px;   /* Reduced from 250px */
  min-width: 180px;   /* Reduced from 250px */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.course-preview .highlight-text.top-label {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0;
  margin-left: 0;
  margin-top: 0;
  text-align: center;
  display: block;
  width: max-content;
  z-index: 2;
}

.course-info {
  padding: 48px;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* changed from center */
  overflow: hidden;
}
.course-info .highlight-text.top-label {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 16px; /* Increased space below the label */
  margin-left: 0;
  margin-top: 0;
  text-align: center;
  display: block;
  width: max-content;
  z-index: 2;
}

.course a {
	color: #fff;
	display: inline-block;
	font-size: 12px;
	opacity: 0.6;
	margin-top: 30px;
	text-decoration: none;
}

.btn {
    background-color: #1746a2;
    border: 0;
    border-radius: 50px;
    color: #fff;
    font-size: 14px;         /* Reduced from 16px */
    padding: 8px 18px;       /* Reduced from 12px 25px */
    position: absolute;
    bottom: 30px;
    right: 30px;
    letter-spacing: 1px;
}

.truncate-multi {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-width: 100%;
  max-height: 3.2em; 
}
</style>