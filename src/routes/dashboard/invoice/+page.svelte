<script lang="ts">
  import { onMount } from 'svelte';
  import { sendInvoiceEmail } from '../../../lib/store/api';
  import { toast, Toaster } from 'svelte-sonner';
  import { 
    FileText, 
    Edit3, 
    Mail, 
    Printer, 
    Eye, 
    Save, 
    Plus, 
    Trash2, 
    X,
    Info,
    Loader2
  } from 'lucide-svelte';

  // State management
  let currentView: 'preview' | 'edit' = 'preview';
  let showEmailModal = false;
  let isEmailSending = false;
  
  // Email data
  let emailData = {
    to: '',
    cc: '',
    subject: '',
    message: ''
  };
  
  // Invoice data structure
  let invoice = {
    id: 'INV-2025-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    // Company details
    company: {
      name: 'The Alchemists Lab',
      address: '123 Science Street',
      city: 'Research City',
      postal: '12345',
      email: 'billing@alchemistslab.com',
      phone: '+1 (555) 123-4567'
    },
    
    // Client details
    client: {
      name: 'Research Institute',
      address: '456 University Ave',
      city: 'Academic City',
      postal: '67890',
      email: 'contact@research.edu',
      phone: '+1 (555) 987-6543'
    },
    
    // Invoice items
    items: [
      {
        id: 1,
        description: 'Chemical Analysis - Water Sample',
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00
      },
      {
        id: 2,
        description: 'Soil Composition Test',
        quantity: 2,
        unitPrice: 200.00,
        total: 400.00
      },
      {
        id: 3,
        description: 'pH Level Testing',
        quantity: 1,
        unitPrice: 75.00,
        total: 75.00
      }
    ],
    
    // Totals
    subtotal: 625.00,
    tax: 62.50,
    total: 687.50,
    
    // Additional info
    notes: 'Thank you for choosing The Alchemists Lab for your testing needs.',
    terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly service charge.'
  };

  // Switch between views
  function switchView(view: 'preview' | 'edit') {
    currentView = view;
  }

  // Add new item to invoice
  function addItem() {
    const newItem = {
      id: invoice.items.length + 1,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    invoice.items = [...invoice.items, newItem];
    calculateTotals();
  }

  // Remove item from invoice
  function removeItem(index: number) {
    invoice.items = invoice.items.filter((_, i) => i !== index);
    calculateTotals();
  }

  // Calculate item total
  function calculateItemTotal(item: any) {
    item.total = item.quantity * item.unitPrice;
    calculateTotals();
  }

  // Calculate invoice totals
  function calculateTotals() {
    invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    invoice.tax = invoice.subtotal * 0.1; // 10% tax
    invoice.total = invoice.subtotal + invoice.tax;
  }

  // Print invoice
  function printInvoice() {
    // Get the invoice content
    const invoiceContent = document.getElementById('invoice-content');
    if (!invoiceContent) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Unable to open print window. Please allow pop-ups for this site.');
      return;
    }
    
    // Write the print-ready HTML
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.id} - The Alchemists Lab</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: black;
              background: white;
              padding: 0.5in;
            }
            
            h1, h2, h3, h4, h5, h6 {
              margin-bottom: 0.5rem;
            }
            
            h2 {
              font-size: 18px;
              color: #2563eb;
              font-weight: bold;
            }
            
            h3 {
              font-size: 16px;
              font-weight: bold;
            }
            
            h4 {
              font-size: 14px;
              font-weight: 600;
            }
            
            h5 {
              font-size: 12px;
              font-weight: 600;
            }
            
            p {
              font-size: 11px;
              margin-bottom: 0.25rem;
            }
            
            .flex {
              display: flex;
            }
            
            .justify-between {
              justify-content: space-between;
            }
            
            .justify-end {
              justify-content: flex-end;
            }
            
            .items-start {
              align-items: flex-start;
            }
            
            .text-right {
              text-align: right;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-left {
              text-align: left;
            }
            
            .font-bold {
              font-weight: bold;
            }
            
            .font-semibold {
              font-weight: 600;
            }
            
            .font-medium {
              font-weight: 500;
            }
            
            .mb-8 {
              margin-bottom: 1rem;
            }
            
            .mb-4 {
              margin-bottom: 0.75rem;
            }
            
            .mb-3 {
              margin-bottom: 0.5rem;
            }
            
            .mb-2 {
              margin-bottom: 0.25rem;
            }
            
            .mt-2 {
              margin-top: 0.25rem;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
              font-size: 11px;
            }
            
            th, td {
              padding: 6px 8px;
              border: 1px solid black;
              vertical-align: top;
            }
            
            th {
              background-color: #f9fafb;
              font-weight: 600;
            }
            
            .totals-section {
              width: 300px;
              margin-left: auto;
            }
            
            .border-b {
              border-bottom: 1px solid #e5e7eb;
            }
            
            .border-t {
              border-top: 1px solid #e5e7eb;
              padding-top: 0.75rem;
            }
            
            .py-2 {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
            
            .py-3 {
              padding-top: 0.75rem;
              padding-bottom: 0.75rem;
            }
            
            .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .total-row {
              background-color: #f9fafb;
              font-weight: bold;
              font-size: 14px;
              margin-left: -1rem;
              margin-right: -1rem;
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            @page {
              size: A4 portrait;
              margin: 0.5in;
            }
            
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  }

  // Save invoice (placeholder)
  function saveInvoice() {
    console.log('Saving invoice:', invoice);
    alert('Invoice saved successfully!');
  }

  // Open email modal
  function openEmailModal() {
    // Pre-fill email data
    emailData.to = invoice.client.email;
    emailData.subject = `Invoice ${invoice.id} from ${invoice.company.name}`;
    emailData.message = `Dear ${invoice.client.name},

Please find attached your invoice ${invoice.id} for the amount of ₹${invoice.total.toFixed(2)}.

Invoice Details:
- Invoice Number: ${invoice.id}
- Invoice Date: ${invoice.date}
- Due Date: ${invoice.dueDate}
- Total Amount: ₹${invoice.total.toFixed(2)}

${invoice.notes ? 'Additional Notes: ' + invoice.notes : ''}

Thank you for your business!

Best regards,
${invoice.company.name}
${invoice.company.email}
${invoice.company.phone}`;
    
    showEmailModal = true;
  }

  // Close email modal
  function closeEmailModal() {
    showEmailModal = false;
  }

  // Send email (now with real API integration)
  async function sendEmail() {
    if (isEmailSending) return; // Prevent double submission
    
    isEmailSending = true;
    try {
      console.log('Sending email via API:', emailData);
      
      const response = await sendInvoiceEmail({
        to: emailData.to,
        cc: emailData.cc || undefined,
        subject: emailData.subject,
        message: emailData.message,
        invoiceId: invoice.id,
        invoiceData: invoice
      });

      if (response.success) {
        toast.success(`Email sent successfully to ${emailData.to}!`);
        closeEmailModal();
      } else {
        toast.error(response.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      isEmailSending = false;
    }
  }

  onMount(() => {
    calculateTotals();
  });
</script>

<svelte:head>
  <title>Invoice {invoice.id} - The Alchemists Lab</title>
</svelte:head>

<div class="min-h-screen max-w-6xl mx-auto bg-gray-50 py-8">
  <div class=" px-4 2xl:px-8">
    
    <!-- Header with view toggle -->
    <div class="mb-8 flex justify-between items-center print-hide">
      <h1 class="text-3xl font-bold text-gray-900">Invoice {invoice.id}</h1>
      
      <!-- View Toggle Buttons -->
      <div class="flex space-x-2">
        <button
          class="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                 {currentView === 'preview' 
                   ? 'bg-blue-600 text-white' 
                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}"
          on:click={() => switchView('preview')}
        >
          <FileText size={16} />
          Preview
        </button>
        <button
          class="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                 {currentView === 'edit' 
                   ? 'bg-blue-600 text-white' 
                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}"
          on:click={() => switchView('edit')}
        >
          <Edit3 size={16} />
          Edit
        </button>
      </div>
    </div>

    <!-- Invoice Content -->
    <div class="bg-white rounded-lg overflow-hidden">
      
      {#if currentView === 'preview'}
        <!-- PREVIEW VIEW -->
        <div class="p-8" id="invoice-content">
          
          <!-- Invoice Header -->
          <div class="flex justify-between items-start mb-8">
            <div>
              <h2 class="text-2xl font-bold text-blue-600">{invoice.company.name}</h2>
              <div class="text-gray-600 mt-2">
                <p>{invoice.company.address}</p>
                <p>{invoice.company.city}, {invoice.company.postal}</p>
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
              </div>
            </div>
            <div class="text-right">
              <h3 class="text-2xl font-bold text-gray-900">INVOICE</h3>
              <p class="text-gray-600 mt-2">Invoice #: {invoice.id}</p>
              <p class="text-gray-600">Date: {invoice.date}</p>
              <p class="text-gray-600">Due Date: {invoice.dueDate}</p>
            </div>
          </div>

          <!-- Bill To -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Bill To:</h4>
            <div class="text-gray-700">
              <p class="font-medium">{invoice.client.name}</p>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.city}, {invoice.client.postal}</p>
              <p>{invoice.client.email}</p>
              <p>{invoice.client.phone}</p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="mb-8">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                  <th class="border border-gray-300 px-4 py-3 text-center font-semibold">Qty</th>
                  <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Unit Price</th>
                  <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {#each invoice.items as item}
                  <tr>
                    <td class="border border-gray-300 px-4 py-3">{item.description}</td>
                    <td class="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                    <td class="border border-gray-300 px-4 py-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                    <td class="border border-gray-300 px-4 py-3 text-right">₹{item.total.toFixed(2)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="flex justify-end mb-8">
            <div class="totals-section">
              <div class="flex justify-between py-2 border-b">
                <span class="font-medium">Subtotal:</span>
                <span>₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between py-2 border-b">
                <span class="font-medium">Tax (10%):</span>
                <span>₹{invoice.tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between py-3 text-lg font-bold total-row">
                <span>Total:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Notes and Terms -->
          <div class="border-t border-gray-200 pt-6">
            {#if invoice.notes}
              <div class="mb-4">
                <h5 class="font-semibold text-gray-900 mb-2">Notes:</h5>
                <p class="text-gray-700">{invoice.notes}</p>
              </div>
            {/if}
            {#if invoice.terms}
              <div>
                <h5 class="font-semibold text-gray-900 mb-2">Terms & Conditions:</h5>
                <p class="text-gray-700 text-sm">{invoice.terms}</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Preview Actions -->
        <div class="px-8 py-4 bg-gray-50 border-t flex justify-end space-x-3 print-hide">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            on:click={openEmailModal}
          >
            <Mail size={16} />
            Send via Email
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            on:click={printInvoice}
          >
            <Printer size={16} />
            Print
          </button>
          <button
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            on:click={() => switchView('edit')}
          >
            <Edit3 size={16} />
            Edit Invoice
          </button>
        </div>

      {:else}
        <!-- EDIT VIEW -->
        <div class="p-8">
          
          <!-- Invoice Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 class="text-lg font-semibold mb-4">Invoice Details</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
                  <input
                    type="text"
                    bind:value={invoice.id}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    bind:value={invoice.date}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    bind:value={invoice.dueDate}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Client Details -->
            <div>
              <h4 class="text-lg font-semibold mb-4">Client Details</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    bind:value={invoice.client.name}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    bind:value={invoice.client.address}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      bind:value={invoice.client.city}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      bind:value={invoice.client.postal}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    bind:value={invoice.client.email}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold">Invoice Items</h4>
              <button
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                on:click={addItem}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div class="space-y-4">
              {#each invoice.items as item, index}
                <div class="p-4 border border-gray-200 rounded-lg">
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div class="md:col-span-5">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        bind:value={item.description}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        bind:value={item.quantity}
                        on:input={() => calculateItemTotal(item)}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                      <input
                        type="number"
                        step="0.01"
                        bind:value={item.unitPrice}
                        on:input={() => calculateItemTotal(item)}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-right">
                        ₹{item.total.toFixed(2)}
                      </div>
                    </div>
                    <div class="md:col-span-1">
                      <button
                        class="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        on:click={() => removeItem(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Totals Display -->
          <div class="flex justify-end mb-8">
            <div class="w-80 p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between py-2">
                <span class="font-medium">Subtotal:</span>
                <span>₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="font-medium">Tax (10%):</span>
                <span>₹{invoice.tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between py-2 text-lg font-bold border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Notes and Terms -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                bind:value={invoice.notes}
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes for the client..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea
                bind:value={invoice.terms}
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Payment terms and conditions..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Edit Actions -->
        <div class="px-8 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            on:click={() => switchView('preview')}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            on:click={saveInvoice}
          >
            <Save size={16} />
            Save Invoice
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Email Modal -->
{#if showEmailModal}
  <div class="modal-backdrop">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200 bg-white">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">Send Invoice via Email</h3>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors"
            on:click={closeEmailModal}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-4 bg-white">
        <!-- To Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To *</label>
          <input
            type="email"
            bind:value={emailData.to}
            required
            placeholder="client@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- CC Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">CC (optional)</label>
          <input
            type="email"
            bind:value={emailData.cc}
            placeholder="manager@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
          <input
            type="text"
            bind:value={emailData.subject}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
          <textarea
            bind:value={emailData.message}
            required
            rows="8"
            placeholder="Enter your message here..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          ></textarea>
        </div>

        <!-- Invoice Preview Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <Info size={16} class="text-blue-600 mt-0.5 mr-2" />
            <div class="text-sm">
              <p class="text-blue-800 font-medium">Invoice Details</p>
              <p class="text-blue-700 mt-1">
                The invoice PDF will be automatically attached to this email.
                <br>
                <strong>Invoice:</strong> {invoice.id} | <strong>Amount:</strong> ₹{invoice.total.toFixed(2)} | <strong>Due:</strong> {invoice.dueDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          on:click={closeEmailModal}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          on:click={sendEmail}
          disabled={!emailData.to || !emailData.subject || !emailData.message || isEmailSending}
        >
          {#if isEmailSending}
            <Loader2 size={16} class="animate-spin" />
            Sending...
          {:else}
            <Mail size={16} />
            Send Email
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Toast notifications -->
<Toaster />

<style>
  /* Modal specific styles to ensure proper display */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 42rem;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    z-index: 10000;
  }
</style>
