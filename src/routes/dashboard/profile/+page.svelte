<script lang="ts">
  import { onMount } from 'svelte';
  let activeCard: string | null = "personal";

  // --- Personal Info ---
  let fullName = "John Doe";
  let status = "Active";
  let role = "Developer";
  let country = "USA";
  let languages = ["English"];
  let contact = "(123) 456-7890";
  let skype = "john.doe";
  let email = "john.doe@example.com";
  let teams = [
    { name: "Backend Developer", members: 126 },
    { name: "React Developer", members: 98 },
  ];

  // Paperless Preferences
  let paperless = false;
  let emailConfirm = false;
  let emailAttach = false;
  let shipmentTracking = false;
  let repromiseNotify = false;

  // --- Reusable Address Type ---
  type Address = {
    id: number;
    country: string;
    label: string;
    mobile: string;
    pincode: string;
    flat: string;
    area: string;
    landmark: string;
    city: string;
    state: string;
    isDefault: boolean;
    instructions: string;
  };

  // --- Profile Addresses ---
  let addresses: Address[] = [];
  onMount(() => {
    addresses = [
      {
        id: 1,
        country: 'USA',
        label: 'Alice Johnson',
        mobile: '555-123-4567',
        pincode: '10001',
        flat: '123 Main Street Apt 4B',
        area: 'Chelsea',
        landmark: 'Near Hudson River Park',
        city: 'New York',
        state: 'NY',
        isDefault: true,
        instructions: ''
      },
      {
        id: 2,
        country: 'Canada',
        label: 'Bob Smith',
        mobile: '604-987-6543',
        pincode: 'V5K 0A1',
        flat: '456 Oakwood Drive',
        area: 'Kitsilano',
        landmark: 'Next to Granville Island',
        city: 'Vancouver',
        state: 'British Columbia',
        isDefault: false,
        instructions: ''
      },
      {
        id: 3,
        country: 'Australia',
        label: 'Charlie Brown',
        mobile: '0412 345 678',
        pincode: '2000',
        flat: '789 Kangaroo Road',
        area: 'Surry Hills',
        landmark: 'Opposite Central Station',
        city: 'Sydney',
        state: 'NSW',
        isDefault: false,
        instructions: ''
      }
    ];
  });

  // --- Payment Section State ---
  let paymentType = 'card';
  let cardName = '';
  let cardNumber = '';
  let expiry = '';
  let cvv = '';
  let saveCard = false;

  // My Cards List
  type Card = { id: number; type: string; logo: string; owner: string; last4: string; expiry: string; isPrimary: boolean };
  let cards: Card[] = [
    { id: 1, type: 'Mastercard', logo: '/images/mastercard.png', owner: 'Tom McBride', last4: '9856', expiry: '12/26', isPrimary: true },
    { id: 2, type: 'Visa', logo: '/images/visa.png', owner: 'Mildred Wagner', last4: '5896', expiry: '10/27', isPrimary: false }
  ];

  let isAddingCard = false;
  let editingCardId: number | null = null;
  let cardForm: Card = { id: 0, type: '', logo: '', owner: '', last4: '', expiry: '', isPrimary: false };

  function startAddCard() {
    isAddingCard = true;
    editingCardId = null;
    cardForm = { ...cardForm, id: 0, type: '', logo: '', owner: '', last4: '', expiry: '', isPrimary: false };
  }
  function editCard(id: number) {
    const c = cards.find(c => c.id === id);
    if (c) {
      editingCardId = id;
      isAddingCard = false;
      cardForm = { ...c };
    }
  }
  function cancelCard() {
    isAddingCard = false;
    editingCardId = null;
  }
  function submitCard() {
    if (editingCardId) {
      cards = cards.map(c => c.id === editingCardId ? { ...cardForm } : c);
    } else {
      cardForm.id = Date.now();
      cards = [...cards, { ...cardForm }];
    }
    cancelCard();
  }
  function deleteCard(id: number) {
    cards = cards.filter(c => c.id !== id);
  }

  // --- Billing Addresses ---
  let billingAddresses: Address[] = [
    { id: 1, country: 'USA', label: 'John Doe', mobile: '(202) 555-0111', pincode: '90210', flat: '742 Evergreen Terrace', area: '', landmark: '', city: 'Beverly Hills', state: 'CA', isDefault: true, instructions: '' }
  ];
  let isAddingBilling = false;
  let editingBillingId: number | null = null;
  let billingForm: Address = { id:0, country:'', label:'', mobile:'', pincode:'', flat:'', area:'', landmark:'', city:'', state:'', isDefault:false, instructions:'' };

  function startAddBilling() {
    isAddingBilling = true;
    editingBillingId = null;
    billingForm = { ...billingForm, id: 0 };
  }
  function editBilling(id: number) {
    const a = billingAddresses.find(a => a.id === id);
    if (a) {
      editingBillingId = id;
      isAddingBilling = false;
      billingForm = { ...a };
    }
  }
  function cancelBilling() {
    isAddingBilling = false;
    editingBillingId = null;
  }
  function submitBilling() {
    if (editingBillingId) {
      billingAddresses = billingAddresses.map(a => a.id === editingBillingId ? { ...billingForm } : a);
    } else {
      billingForm.id = Date.now();
      billingAddresses = [...billingAddresses, { ...billingForm }];
    }
    cancelBilling();
  }
  function deleteBilling(id: number) {
    billingAddresses = billingAddresses.filter(a => a.id !== id);
  }

   // --- Billing History ---
  type Invoice = { id: number; number: string; status: string; client: string; project: string; avatar: string; total: string; date: string; balance: string };
  let invoices: Invoice[] = [
    { id: 1, number: '5089', status:'Paid', client:'Jamal Kerrod', project:'Software Development', avatar:'/images/avatar1.png', total:'$3077', date:'09 May 2020', balance:'0' },
    { id: 2, number: '5041', status:'Pending', client:'Shamus Tuttle', project:'UX Design', avatar:'/images/avatar2.png', total:'$2230', date:'19 Nov 2020', balance:'$2230' }
  ];
  let histPageSize = '10';
  let histSearch = '';
  let histFilter = 'All Status';
  function createInvoice() {
    alert('Create Invoice not implemented');
  }


  let isAdding = false;
  let editingId: number | null = null;
  let form: Address = {
    id: 0,
    country: 'India',
    label: '',
    mobile: '',
    pincode: '',
    flat: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    isDefault: false,
    instructions: ''
  };

  function startAdd() {
    isAdding = true;
    editingId = null;
    form = { ...form, id: 0 };
  }

  function startEdit(id: number) {
    const a = addresses.find(a => a.id === id);
    if (a) {
      editingId = id;
      isAdding = false;
      form = { ...a };
    }
  }

  function cancel() {
    isAdding = false;
    editingId = null;
  }

  function submit() {
    if (editingId) {
      addresses = addresses.map(a => a.id === editingId ? { ...form } : a);
    } else {
      form.id = Date.now();
      addresses = [...addresses, { ...form }];
    }
    cancel();
  }

  function deleteAddress(id: number) {
    addresses = addresses.filter(a => a.id !== id);
  }

  function setDefault(id: number) {
    addresses = addresses.map(a => ({ ...a, isDefault: a.id === id }));
  }

  let isEditingPersonal = false;

  function toggleEditPersonal() {
    isEditingPersonal = !isEditingPersonal;
  }

  function savePersonal() {
    // TODO: persist to server here
    isEditingPersonal = false;
    alert("Personal info saved!");
  }

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
      <div class="profileDetails">
        <h2 class="">John Doe</h2>
        <p class="">johndoe@example.com</p>
      </div>
    </div>
  </div>

  <div class="profileNav">
    <div>
      <button
        class="btn {activeCard === 'personal' ? 'active' : ''}"
        on:click={() => toggleCard("personal")}>Profile</button
      >
      <button
        class="btn {activeCard === 'address' ? 'active' : ''}"
        on:click={() => toggleCard("address")}
      >
        Addresses</button
      >
    </div>
    <div>
      <button
        class="btn {activeCard === 'paperless' ? 'active' : ''}"
        on:click={() => toggleCard("paperless")}>Paperless</button
      >
      <button
        class="btn {activeCard === 'payment' ? 'active' : ''}"
        on:click={() => toggleCard("payment")}
        >Payment
      </button>
    </div>
  </div>
</div>

{#if activeCard === "personal"}
  <div class="personalInfoCard">
    {#if isEditingPersonal}
      <form on:submit|preventDefault={savePersonal} class="form-section">
        <h3>Edit Personal Info</h3>
        <label>
          Full Name
          <input type="text" bind:value={fullName} />
        </label>
        <label>
          Contact
          <input type="tel" bind:value={contact} />
        </label>
        <label>
          Email
          <input type="email" bind:value={email} />
        </label>
        <div style="margin-top:16px;">
          <button type="submit" class="btn active">Save</button>
          <button type="button" class="btn" on:click={toggleEditPersonal}
            >Cancel</button
          >
        </div>
      </form>
    {:else}
      <section class="profileSection">
        <h3>About</h3>
        <ul>
          <li class="item">
            <span class="icon">👤</span>
            <span class="label">Full Name:</span>
            <span class="value">{fullName}</span>
          </li>
          <li class="item">
            <span class="icon">✔️</span>
            <span class="label">Status:</span>
            <span class="value">{status}</span>
          </li>
          <li class="item">
            <span class="icon">👑</span>
            <span class="label">Role:</span>
            <span class="value">{role}</span>
          </li>
          <li class="item">
            <span class="icon">🏳️</span>
            <span class="label">Country:</span>
            <span class="value">{country}</span>
          </li>
          <li class="item">
            <span class="icon">🌐</span>
            <span class="label">Languages:</span>
            <span class="value">{languages.join(", ")}</span>
          </li>
        </ul>
      </section>
      <section class="profileSection">
      <h3>Contacts</h3>
      <ul>
        <li class="item">
          <span class="icon">📞</span>
          <span class="label">Contact:</span>
          <span class="value">{contact}</span>
        </li>
        <li class="item">
          <span class="icon">💬</span>
          <span class="label">Skype:</span>
          <span class="value">{skype}</span>
        </li>
        <li class="item">
          <span class="icon">✉️</span>
          <span class="label">Email:</span>
          <span class="value">{email}</span>
        </li>
      </ul>
    </section>
    <section class="profileSection">
      <h3>Teams</h3>
      <ul>
        {#each teams as team}
          <li class="team-item">
            <span class="label">{team.name}</span>
            <span class="value">({team.members} Members)</span>
          </li>
        {/each}
      </ul>
    </section>
      <button
        class="btn active"
        style="margin-top:16px;"
        on:click={toggleEditPersonal}
      >
        Edit
      </button>
    {/if}
  </div>
{/if}

{#if activeCard === "address"}
  {#if isAdding || editingId}
    <div class="address-form-card">
      <nav class="breadcrumb">
        <span on:click={cancel} class="backlink">Your Addresses</span> › <span>{editingId ? 'Edit' : 'Add'} Address</span>
      </nav>
      <form on:submit|preventDefault={submit}>
        <label>
          Country/Region
          <select bind:value={form.country}>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>
        </label>
        <label>
          Full name (First and Last name)
          <input type="text" bind:value={form.label} required />
        </label>
        <label>
          Mobile number
          <input type="tel" bind:value={form.mobile} required />
          <small>May be used to assist delivery</small>
        </label>
        <label>
          Pincode
          <input type="text" bind:value={form.pincode} required />
        </label>
        <label>
          Flat, House no., Building, Company, Apartment
          <input type="text" bind:value={form.flat} required />
        </label>
        <label>
          Area, Street, Sector, Village
          <input type="text" bind:value={form.area} />
        </label>
        <label>
          Landmark
          <input type="text" bind:value={form.landmark} />
        </label>
        <div class="row two-cols">
          <label>
            Town/City
            <input type="text" bind:value={form.city} required />
          </label>
          <label>
            State
            <input type="text" bind:value={form.state} required />
          </label>
        </div>
        <label class="default-checkbox">
          <input type="checkbox" bind:checked={form.isDefault} />
          Make this my default address
        </label>
        <div class="delivery-instructions">
          <span>Delivery instructions (optional)</span>
          <button type="button">Add preferences, notes, access codes and more</button>
        </div>
        <div class="form-footer">
          <button type="submit" class="btn-primary">
            {editingId ? 'Update address' : 'Add address'}
          </button>
          <button type="button" class="btn-secondary" on:click={cancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  {:else}
    <div class="address-dashboard-card">
      <header>
        <h3>Your Addresses</h3>
        <button class="btn-add" on:click={startAdd}>+ Add Address</button>
      </header>
      <div class="addresses-grid">
        <!-- Add tile -->
        <div class="address-card add-card" on:click={startAdd}>
          <span class="plus-icon">+</span>
          <span>Add address</span>
        </div>
        {#each addresses as addr (addr.id)}
          <div class="address-card">
            {#if addr.isDefault}
              <div class="default-label">Default</div>
            {/if}
            <div class="address-details">
              <strong>{addr.label}</strong>
              <p>{addr.flat}</p>
              {#if addr.area}<p>{addr.area}</p>{/if}
              {#if addr.landmark}<p>{addr.landmark}</p>{/if}
              <p>{addr.city}, {addr.state} {addr.pincode}</p>
              <p>{addr.country}</p>
              <p>Phone number: {addr.mobile}</p>
            </div>
            <div class="address-actions">
              <button class="link-btn" on:click={() => startEdit(addr.id)}>Edit</button>
              <button class="link-btn" on:click={() => deleteAddress(addr.id)}>Remove</button>
              {#if !addr.isDefault}
                <button class="link-btn" on:click={() => setDefault(addr.id)}>Set as Default</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
{/if}

{#if activeCard === "paperless"}
  <div class="preferences-dashboard-card">
    <header>
      <h3>Paperless Preferences</h3>
    </header>

    <div class="preferences-grid">
      <div class="preference-card">
        <div class="info">
          <span class="icon">🌿</span>
          <h4>Go Paperless</h4>
          <p>Reduce your environmental footprint.</p>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={paperless} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="preference-card">
        <div class="info">
          <span class="icon">📧</span>
          <h4>Email Confirmations</h4>
          <p>Send my order confirmation via email.</p>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={emailConfirm} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="preference-card">
        <div class="info">
          <span class="icon">📎</span>
          <h4>Attach Confirmations</h4>
          <p>Include the confirmation as an attachment.</p>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={emailAttach} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="preference-card">
        <div class="info">
          <span class="icon">🚚</span>
          <h4>Shipment Tracking</h4>
          <p>Send shipment tracking to my email.</p>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={shipmentTracking} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="preference-card">
        <div class="info">
          <span class="icon">🔔</span>
          <h4>Repromise Notifications</h4>
          <p>Send repromise notifications via email.</p>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={repromiseNotify} />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <button class="btn-primary save-btn" on:click={() => handleSubmit('Paperless Preferences')}>Save Preferences</button>
  </div>
{/if}

{#if activeCard === "payment"}
  <div class="payment-card">
    <!-- Payment Methods -->
    <section class="payment-methods">
      <h3>Payment Methods</h3>
      <form on:submit|preventDefault={() => handleSubmit('Payment Methods')} class="payment-form">
        <div class="payment-options">
          <label><input type="radio" bind:group={paymentType} value="card" /> Credit/Debit/ATM Card</label>
          <label><input type="radio" bind:group={paymentType} value="paypal" /> PayPal account</label>
        </div>
        {#if paymentType === 'card'}
          <div class="form-fields">
            <label>
              Card Number
              <input type="text" bind:value={cardNumber} placeholder="0000 0000 0000 0000" maxlength="19" required />
            </label>
            <div class="row two-cols">
              <label>
                Name
                <input type="text" bind:value={cardName} placeholder="John Doe" required />
              </label>
              <label>
                Exp. Date
                <input type="text" bind:value={expiry} placeholder="MM/YY" maxlength="5" required />
              </label>
              <label>
                CVV Code <span class="help-icon" title="3‑digit code on back">?</span>
                <input type="password" bind:value={cvv} placeholder="123" maxlength="4" required />
              </label>
            </div>
            <label class="save-card">
              <input type="checkbox" bind:checked={saveCard} />
              <p> Save card for future billing?</p>
            </label>
          </div>
        {/if}
        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
          <button type="button" class="btn-secondary" on:click={() => toggleCard('payment')}>Cancel</button>
        </div>
      </form>
    </section>

    <!-- My Cards -->
    <section class="my-cards">
      <div class="my-cards-header">
        <h3>My Cards</h3>
      <!-- {#if isAddingCard || editingCardId}
        <form on:submit|preventDefault={submitCard} class="card-form">
          <label>Card Type<select bind:value={cardForm.type} required>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
          </select></label>
          <label>Logo URL<input type="url" bind:value={cardForm.logo} placeholder="/images/visa.png" /></label>
          <label>Owner<input type="text" bind:value={cardForm.owner} required /></label>
          <label>Last 4 Digits<input type="text" bind:value={cardForm.last4} maxlength="4" required /></label>
          <label>Expiry<input type="text" bind:value={cardForm.expiry} placeholder="MM/YY" required /></label>
          <label><input type="checkbox" bind:checked={cardForm.isPrimary} /> Primary</label>
          <div class="form-actions">
            <button type="submit" class="btn-primary">{editingCardId? 'Update' : 'Add'} Card</button>
            <button type="button" class="btn-secondary" on:click={cancelCard}>Cancel</button>
          </div>
        </form>
      {:else}
        <button class="btn-primary" on:click={startAddCard}>+ Add Card</button>
      {/if} -->
      </div>
      <div class="cards-grid">
        {#each cards as card (card.id)}
          <div class="card-item">
            <div class="card-details">
              <img src={card.logo} alt={card.type} class="card-logo" />
              <div>
                <div class="owner">{card.owner} {#if card.isPrimary}<span class="badge">Primary</span>{/if}</div>
                <div>**** **** {card.last4}</div>
                <div>Exp: {card.expiry}</div>
              </div>
            </div>
            <div class="actions">
              <button class="link-btn" on:click={() => editCard(card.id)}>Edit</button>
              <button class="link-btn delete" on:click={() => deleteCard(card.id)}>Delete</button>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Billing Address -->
    <section class="billing-address">
      <h3>Billing Address</h3>
      {#if isAddingBilling || editingBillingId}
        <form on:submit|preventDefault={submitBilling} class="billing-form">
          <!-- reuse same fields as address-form-card -->
          <label>Country<select bind:value={billingForm.country} required>
            <option>USA</option><option>Canada</option><option>Australia</option>
          </select></label>
          <label>Full name<input type="text" bind:value={billingForm.label} required /></label>
          <label>Mobile<input type="tel" bind:value={billingForm.mobile} /></label>
          <label>Flat<input type="text" bind:value={billingForm.flat} required /></label>
          <label>City<input type="text" bind:value={billingForm.city} required /></label>
          <label>State<input type="text" bind:value={billingForm.state} required /></label>
          <label>Pincode<input type="text" bind:value={billingForm.pincode} required /></label>
          <label><input type="checkbox" bind:checked={billingForm.isDefault} /> Default</label>
          <div class="form-actions">
            <button type="submit" class="btn-primary">{editingBillingId? 'Update' : 'Add'} Address</button>
            <button type="button" class="btn-secondary" on:click={cancelBilling}>Cancel</button>
          </div>
        </form>
      {:else}
        <button class="btn-primary" on:click={startAddBilling}>+ Add Billing Address</button>
      {/if}

      <div class="addresses-grid">
        {#each billingAddresses as addr (addr.id)}
          <div class="address-card">
            {#if addr.isDefault}<div class="default-label">Default</div>{/if}
            <strong>{addr.label}</strong>
            <p>{addr.flat}</p>
            <p>{addr.city}, {addr.state} {addr.pincode}</p>
            <div class="actions">
              <button class="link-btn" on:click={() => editBilling(addr.id)}>Edit</button>
              <button class="link-btn delete" on:click={() => deleteBilling(addr.id)}>Delete</button>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Billing History -->
    <section class="billing-history">
      <h3>Billing History</h3>
      <div class="history-controls">
        <label>Show<select bind:value={histPageSize}><option>10</option><option>25</option><option>50</option></select></label>
        <button class="btn-primary" on:click={createInvoice}>+ Create Invoice</button>
        <input class="search" placeholder="Search Invoice" bind:value={histSearch} />
        <select bind:value={histFilter}><option>All Status</option><option>Paid</option><option>Pending</option><option>Overdue</option></select>
      </div>
      <table class="history-table">
        <thead>
          <tr><th></th><th>#</th><th>Status</th><th>Client</th><th>Total</th><th>Issued Date</th><th>Balance</th></tr>
        </thead>
        <tbody>
          {#each invoices as inv (inv.id)}
            <tr>
              <td><input type="checkbox" /></td>
              <td class="link">#{inv.number}</td>
              <td><span class="badge status-{inv.status.toLowerCase()}"></span></td>
              <td class="client-cell"><img src={inv.avatar} class="avatar"/><div><div>{inv.client}</div><small>{inv.project}</small></div></td>
              <td>{inv.total}</td>
              <td>{inv.date}</td>
              <td class={inv.balance.startsWith('-')?'negative':''}>{inv.balance}</td>
            </tr>
          {/each}
        </tbody>
      </table>
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
  .profile-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13.75rem, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .section {
    background: #fff;
    border: .0625rem solid #e5e7eb;
    border-radius: .625rem;
    padding: 19.2px;
    cursor: pointer;
    transition: box-shadow 0.2s;
    box-shadow: 0 .125rem .5rem rgba(0, 0, 0, 0.03);
  }
  .profile-card.active,
  .profile-card:hover {
    box-shadow: 0 .25rem 1rem rgba(99, 102, 241, 0.08);
    border-color: #6366f1;
  }
  .form-section {
    background: #fff;
    border-radius: .625rem;
    padding: 32px;
    margin-top: 16px;
    box-shadow: 0 .125rem .5rem rgba(0, 0, 0, 0.03);
    border: .0625rem solid #e5e7eb;
    max-width: 37.5rem;
  }
  .form-section h3 {
    margin-bottom: 24px;
  }
  .form-section form {
    display: grid;
    gap: 16px;
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
  .personalInfoCard {
    background: #fff;
    padding: 24px;
    border-radius: .625rem;
    box-shadow: 0 .125rem .5rem rgba(0, 0, 0, 0.05);
    margin-top: 16px;
  }
  .profileSection ul {
    list-style: none;
    padding: .625rem;
    margin: 0;
  }
  .profileSection li {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .breadcrumb {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 16px;
  }
  .breadcrumb span + span {
    margin: 0 4px;
  }
  .autofill-banner {
    border: .0625rem solid #3b82f6;
    background: #eff6ff;
    padding: 16px;
    border-radius: .25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .autofill-banner button {
    background: #3b82f6;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: .25rem;
    cursor: pointer;
  }
  .address-form-card form {
    background: #fff;
    border: .0625rem solid #e5e7eb;
    border-radius: .375rem;
    padding: 24px;
    display: grid;
    gap: 16px;
  }
  .address-form-card label {
    font-size: 14px;
  }
  .address-form-card input,
  .address-form-card select {
    width: 100%;
    padding: 8px;
    border: .0625rem solid #d1d5db;
    border-radius: .25rem;
    margin-top: 4px;
  }
  .address-form-card small {
    color: #6b7280;
    font-size: 12px;
  }
  .row.two-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .default-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  .delivery-instructions {
    font-size: 14px;
  }
  .delivery-instructions button {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
  }
  .form-footer {
    display: flex;
    gap: 8px;
    margin-top: 16px;
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
  .address-dashboard-card {
    background: #fff;
    border-radius: .5rem;
    padding: 24px;
    box-shadow: 0 .125rem .75rem rgba(0,0,0,0.05);
    margin-top: 16px;
  }
  .address-dashboard-card header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .btn-add {
    background: #3b82f6;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: .25rem;
    cursor: pointer;
  }
  .addresses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16.25rem, 1fr));
    gap: 16px;
  }
  .address-card {
    background: #f9fafb;
    border: .0625rem solid #e5e7eb;
    border-radius: .375rem;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .add-card {
    border: .125rem dashed #9ca3af;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: transparent;
  }
  .add-card .plus-icon {
    font-size: 32px;
    color: #6b7280;
    margin-bottom: 4px;
  }
  .default-label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .address-details strong {
    font-size: 16px;
    color: #111827;
    margin-bottom: 4px;
    display: block;
  }
  .address-details p {
    margin: 4px 0;
    font-size: 14px;
    color: #374151;
  }
  .address-actions {
    margin-top: auto;
    display: flex;
    gap: 8px;
    font-size: 14px;
  }
  .link-btn {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    padding: 0;
  }
  .backlink{
    color: #3b82f6;
    cursor: pointer;
    margin-right: .3125rem;
  }
  .preferences-dashboard-card {
    background: #fff;
    border-radius: .5rem;
    padding: 24px;
    box-shadow: 0 .125rem .75rem rgba(0,0,0,0.05);
    margin-top: 16px;
  }
  .preferences-dashboard-card header h3 {
    margin-bottom: 16px;
    font-size: 20px;
    color: #111827;
  }
  .preferences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
    gap: 16px;
  }
  .preference-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    border: .0625rem solid var(--border, #e5e7eb);
    border-radius: .375rem;
    padding: 16px;
  }
  .preference-card .info {
    max-width: 70%;
  }
  .preference-card .info .icon {
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
  }
  .preference-card .info h4 {
    margin: 0;
    font-size: 16px;
    color: #111827;
  }
  .preference-card .info p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #374151;
  }
  /* Toggle Switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 2.5rem;
    height: 1.25rem;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 1.25rem;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 1rem;
    width: 1rem;
    left: .125rem;
    bottom: .125rem;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: var(--primary, #4f46e5);
  }
  input:checked + .slider:before {
    transform: translateX(1.25rem);
  }
  .btn-primary.save-btn {
    margin-top: 16px;
    background: var(--primary, #4f46e5);
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: .25rem;
    cursor: pointer;
    font-weight: 600;
  }
  /* ================= Payment Section ================= */

/* --- Payment Methods Form --- */
.payment-methods{
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}
.payment-methods h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #111827;
}
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.payment-options {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}
.payment-options label {
  font-size: 0.875rem;
  cursor: pointer;
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
.help-icon {
  display: inline-block;
  margin-left: 0.25rem;
  color: #6b7280;
  cursor: help;
}
.save-card {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
}
.save-card input {
  width: auto;
  margin-right: 0.5rem;
}
.save-card p {
  margin: 0;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* --- My Cards Grid --- */
.my-cards{
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}
.my-cards .my-cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.my-cards h3 {
  font-size: 1.25rem;
  color: #111827;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
  gap: 1rem;
}
.card-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.card-logo {
  width: 40px;
  height: auto;
}
.owner {
  font-weight: 600;
  color: #111827;
}
.badge {
  background: #3b82f6;
  color: #fff;
  border-radius: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}
.actions .link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.875rem;
}
.actions .delete {
  color: #dc2626;
}
.cards-grid .add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #9ca3af;
  background: transparent;
  cursor: pointer;
}

/* --- Billing Address (reuse address grid) --- */
.billing-address {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}
.billing-address h3 {
  font-size: 1.25rem;
  color: #111827;
}
/* .addresses-grid, .address-card, .add-card already defined above */

/* --- Billing History Table --- */
.billing-history {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.billing-history h3 {
  font-size: 1.25rem;
  color: #111827;
}
.history-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.history-controls label,
.history-controls select,
.history-controls .search {
  font-size: 0.875rem;
}
.history-controls .search {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}
.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}
.history-table th {
  text-align: left;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
.history-table td {
  background: #fff;
  padding: 0.75rem;
  vertical-align: middle;
  font-size: 0.875rem;
}
.client-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.negative {
  color: #dc2626;
}

.card-form,
  .billing-form {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: grid;
    gap: 0.75rem;
    max-width: 480px;
  }
  .card-form label,
  .billing-form label {
    font-size: 0.875rem;
    display: block;
  }
  .card-form input,
  .card-form select,
  .billing-form input,
  .billing-form select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    margin-top: 0.25rem;
  }

/* ============== Responsive ============== */

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
    .preferences-grid {
      grid-template-columns: 1fr;
    }
    .payment-options,
  .form-fields .row.two-cols,
  .cards-grid,
  .addresses-grid,
  .history-controls {
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
    .preferences-grid {
      grid-template-columns: 1fr;
    }
    .payment-options,
  .form-fields .row.two-cols,
  .cards-grid,
  .addresses-grid,
  .history-controls {
    display: block;
  }
  .form-fields .row.two-cols > label {
    margin-bottom: 1rem;
  }
  }
  @media (min-width: 48.0625rem) and (max-width: 62rem) {
  }
  @media (min-width: 87.5rem) {
  }
</style>
