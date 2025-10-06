<script lang="ts">

  function title(s?: string | null) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  let paymentType = 'card';
  let cardName = '';


  // Track which card section is active
  let activeCard: string | null = "personal";
  function toggleCard(card: string) {
    activeCard = activeCard === card ? null : card;
  }
  function handleSubmit(section: string) {
    alert(`Saved ${section}!`);
  }
  
</script>

<div>
  <div class="profileCard">
    <div class="profileHeader">
      <img
        src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/profile-banner.png"
        alt="Profile Banner"
        height="12.5rem"
        width="100%"
      />
    </div>
    <div class="profileContent">
      <div class="profileAvatar">
        <img
          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/avatars/1.png"
          alt="Profile Avatar"
        />
      </div>      
    </div>
  </div>

  <div class="profileNav">
    <div>
      <button
        class="btn {activeCard === 'Security' ? 'active' : ''}"
        on:click={() => toggleCard("Security")}>Security</button
      >
      <button
        class="btn {activeCard === 'support' ? 'active' : ''}"
        on:click={() => toggleCard("support")}
      >
        Support</button
      >
      <button
        class="btn {activeCard === 'account' ? 'active' : ''}"
        on:click={() => toggleCard("account")}>Account</button
      >
      <button
        class="btn {activeCard === 'payment' ? 'active' : ''}"
        on:click={() => toggleCard("payment")}
        >Payment
      </button>
    </div>
  </div>
</div>

{#if activeCard === "Security"}
  <div>
    <!-- security Methods -->
    <section class="security-methods">
      <h3>Change Password</h3>
      <form on:submit|preventDefault={() => handleSubmit('Change Password')} class="security-form">
        {#if paymentType === 'card'}
          <div class="form-fields">            
            <div class="row two-cols">
              <label>
                Current password
                <input type="text" bind:value={cardName} placeholder="John Doe" required />
              </label>
             <label>
                New password
                <input type="text" bind:value={cardName} placeholder="John Doe" required />
              </label>
              <label>
                Confirm password
                <input type="text" bind:value={cardName} placeholder="John Doe" required />
              </label>
            </div>
          </div>
        {/if}
        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
          <button type="button" class="btn-secondary" on:click={() => toggleCard('payment')}>Cancel</button>
        </div>
      </form>
    </section> 
    
    <section class="security-methods">
      <h3>Recovery Options</h3>
      <form on:submit|preventDefault={() => handleSubmit('recovery options')} class="security-form">
        {#if paymentType === 'card'}
          <div class="form-fields">            
            <div class="row two-cols">
              <label>
                Recovery Email
                <input type="text" bind:value={cardName} placeholder="John Doe" required />
              </label>
             <label>
                Recovery Phone
                <input type="text" bind:value={cardName} placeholder="John Doe" required />
              </label>
            </div>
          </div>
        {/if}
        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
          <button type="button" class="btn-secondary" on:click={() => toggleCard('payment')}>Cancel</button>
        </div>
      </form>
    </section> 
   
  </div>
{/if}

<style>
  .profileHeader {
    height: 12.5rem;
    overflow: hidden;
  }
  .profileHeader img {
    width: 100%;
    height: auto;
  }
  .btn {
    border: none;
    padding: 9.6px 19.2px;
    border-radius: .375rem;
    cursor: pointer;
    font-weight: 600;
    width: fit-content;
  }
  .btn.active {
    color: #fff;
    background: #4f46e5;
  }
  .btn:hover {
    background: #dde0f9;
    color: #7885fa;
  }
  label {
    font-weight: 500;
  }
  .profileCard {
    border-radius: .625rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 .125rem .5rem rgba(0, 0, 0, 0.08);
    margin-bottom: 16px;
  }
  .profileContent {
    background: #fff;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .profileAvatar {
    display: flex;
    margin-top: -3.125rem;
  }
  .profileAvatar img {
    border-radius: .5rem;
    width: 6.875rem;
    height: 6.875rem;
    border: .5rem solid #fff;
    box-shadow: 0 .125rem .5rem rgba(0, 0, 0, 0.1);
  }
  .profileNav {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .profileNav div {
    display: flex;
    gap: 8px;
    flex-direction: row;
  }
  .profileNav button {
    width: 100%;
  }

  .row.two-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* Security sections used on this page */
  .security-methods {
    background: #fff;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    margin-bottom: 1.5rem;
  }
  .security-methods h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #111827;
  }
  .security-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .form-fields label {
    display: block;
    margin-bottom: 1rem;
  }
  .form-fields input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    margin-top: 0.25rem;
  }
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .btn-primary {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px;
    border-radius: .25rem;
    cursor: pointer;
    font-weight: 600;
  }
  .btn-secondary {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 12px;
    font-size: 14px;
  }

  /* Responsive: keep only what's needed for current classes */
  @media screen and (max-width: 36rem) {
    .profileContent {
      flex-direction: column;
      text-align: center;
    }
    .profileNav {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .profileNav div {
      gap: 8px;
      justify-content: center;
      align-items: center;
      width: 100%;
      flex-direction: column;
    }
    .profileNav button {
      width: 100%;
      text-align: center;
    }
    .form-fields .row.two-cols {
      display: block;
    }
    .form-fields .row.two-cols > label {
      margin-bottom: 1rem;
    }
  }

  @media (min-width: 36.0625rem) and (max-width: 48rem) {
    .profileNav div {
      flex-direction: column;
      width: 100%;
    }
    .form-fields .row.two-cols {
      display: block;
    }
    .form-fields .row.two-cols > label {
      margin-bottom: 1rem;
    }
  }
</style>


