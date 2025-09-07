<script lang="ts">
  let TestName = "";
  let sku = "";
  let barcode = "";
  let description = "";
  let basePrice = 0;
  let discountedPrice = 0;
  let category = "";
  let collection = "";
  let status = "";
  let tags = "";
  let tier = "Normal";
  let TestImage: File | null = null;

  let categories = ["Chemicals", "Electronics", "Instruments"];
  let newCategory = "";
  let showAddCategory = false;

  function handleImageDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      TestImage = event.dataTransfer.files[0];
    }
  }

  function handleImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      TestImage = target.files[0];
    }
  }

  function addCategory() {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      categories = [...categories, newCategory];
      category = newCategory;
      newCategory = "";
      showAddCategory = false;
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    console.log({
      TestName, sku, barcode, description,
      basePrice, discountedPrice,
      category, collection, status,
      tags, tier, TestImage
    });
  }
</script>

<style>
  .drop-area {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    background-color: #f9f9f9;
  }
</style>

<!-- Info Card -->
<div class="alert alert-info mb-4" role="alert">
  <strong>Note:</strong> You can request to add new test types and upload related images to enhance product data.
</div>

<section class="row match-height">
  <!-- Test Information Form -->
  <div class="col-md-6 col-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Test Information</h4>
      </div>
      <div class="card-body">
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label>Test Name</label>
            <input type="text" bind:value={TestName} class="form-control" placeholder="Enter test name" />
          </div>

          <div class="form-group">
            <label>SKU</label>
            <input type="text" bind:value={sku} class="form-control" placeholder="Enter SKU" />
          </div>

          <div class="form-group">
            <label>Barcode</label>
            <input type="text" bind:value={barcode} class="form-control" placeholder="Enter Barcode" />
          </div>

          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea bind:value={description} class="form-control" placeholder="Short description..."></textarea>
          </div>

          <div class="form-group">
            <label>Test Image</label>
            <div class="drop-area" on:drop={handleImageDrop} on:dragover|preventDefault>
              {#if TestImage}
                <p>{TestImage.name}</p>
              {:else}
                <p>Drag & drop image here or click to upload</p>
              {/if}
              <input type="file" class="form-control mt-2" on:change={handleImageSelect} />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Pricing and Vendor Form -->
  <div class="col-md-6 col-12">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title">Pricing & Vendor Details</h4>
      </div>
      <div class="card-body">
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label>Base Price</label>
            <input type="number" bind:value={basePrice} class="form-control" placeholder="Base price in ₹" />
          </div>

          <div class="form-group">
            <label>Discounted Price</label>
            <input type="number" bind:value={discountedPrice} class="form-control" placeholder="Discounted price in ₹" />
          </div>

          <div class="form-group">
            <label>Category</label>
            <div class="d-flex">
              <select bind:value={category} class="form-control me-2">
                <option value="">Select Category</option>
                {#each categories as cat}
                  <option value={cat}>{cat}</option>
                {/each}
              </select>
              <button type="button" class="btn btn-outline-primary" on:click={() => showAddCategory = !showAddCategory}>
                Add
              </button>
            </div>
            {#if showAddCategory}
              <div class="input-group mt-2">
                <input type="text" bind:value={newCategory} class="form-control" placeholder="New category" />
                <button type="button" class="btn btn-success" on:click={addCategory}>Save</button>
              </div>
            {/if}
          </div>

          <div class="form-group">
            <label>Collection</label>
            <select bind:value={collection} class="form-control">
              <option value="">Select Collection</option>
              <option value="New Arrivals">New Arrivals</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Best Sellers">Best Sellers</option>
            </select>
          </div>

          <div class="form-group">
            <label>Status</label>
            <select bind:value={status} class="form-control">
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" bind:value={tags} class="form-control" placeholder="e.g. lab,test,safety" />
          </div>

          <div class="form-group">
            <label>Tier</label><br />
            <div class="form-check form-check-inline">
              <input type="radio" id="tierNormal" bind:group={tier} value="Normal" class="form-check-input" />
              <label for="tierNormal" class="form-check-label">Normal</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="radio" id="tierStandard" bind:group={tier} value="Standard" class="form-check-input" />
              <label for="tierStandard" class="form-check-label">Standard</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="radio" id="tierPremium" bind:group={tier} value="Premium" class="form-check-input" />
              <label for="tierPremium" class="form-check-label">Premium</label>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-3">
            <button type="submit" class="btn btn-primary me-2">Save Product</button>
            <button type="reset" class="btn btn-secondary">Reset</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
