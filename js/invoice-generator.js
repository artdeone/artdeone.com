// ─── ART de ONE Invoice Generator ───

// ─── State ───
let lineItems = [];
let lineItemCounter = 0;

// ─── Currency symbols ───
const currencySymbols = {
    MMK: 'K',
    USD: '$',
    EUR: '€',
    GBP: '£',
    THB: '฿',
    SGD: 'S$',
    JPY: '¥',
    CNY: '¥'
};

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);

    document.getElementById('inv-date').value = formatDateInput(today);
    document.getElementById('inv-due-date').value = formatDateInput(dueDate);

    // Generate invoice number
    generateInvoiceNumber();

    // Add one default line item
    addLineItem();

    // Update preview
    updatePreview();

    // Attach live preview listeners
    attachPreviewListeners();

    // Load saved invoices
    renderSavedInvoices();

    // Theme toggle icon
    updateThemeIcon();
});

function formatDateInput(date) {
    return date.toISOString().split('T')[0];
}

function generateInvoiceNumber() {
    const saved = JSON.parse(localStorage.getItem('ado_invoices') || '[]');
    const nextNum = saved.length + 1;
    document.getElementById('inv-number').value = 'INV-' + String(nextNum).padStart(3, '0');
}

// ─── Line Items ───
function addLineItem() {
    lineItemCounter++;
    const item = {
        id: lineItemCounter,
        description: '',
        quantity: 1,
        price: 0
    };
    lineItems.push(item);
    renderLineItems();
    updatePreview();
}

function removeLineItem(id) {
    lineItems = lineItems.filter(item => item.id !== id);
    renderLineItems();
    updatePreview();
}

function updateLineItem(id, field, value) {
    const item = lineItems.find(i => i.id === id);
    if (item) {
        if (field === 'description') {
            item[field] = value;
        } else {
            item[field] = parseFloat(value) || 0;
        }
    }
    updatePreview();
}

function renderLineItems() {
    const tbody = document.getElementById('line-items-body');
    const noItemsMsg = document.getElementById('no-items-msg');

    if (lineItems.length === 0) {
        tbody.innerHTML = '';
        noItemsMsg.style.display = 'block';
        return;
    }

    noItemsMsg.style.display = 'none';
    const currency = document.getElementById('inv-currency').value;
    const sym = currencySymbols[currency] || '';

    tbody.innerHTML = lineItems.map(item => {
        const total = item.quantity * item.price;
        return '<tr data-id="' + item.id + '">' +
            '<td>' +
            '<input type="text" class="inv-input" style="padding:8px 10px; font-size:0.85rem;"' +
            ' value="' + escapeHtml(item.description) + '"' +
            ' placeholder="Item description"' +
            ' oninput="updateLineItem(' + item.id + ', \'description\', this.value)">' +
            '</td>' +
            '<td>' +
            '<input type="number" class="inv-input" style="padding:8px 10px; font-size:0.85rem; text-align:center;"' +
            ' value="' + item.quantity + '" min="0" step="1"' +
            ' oninput="updateLineItem(' + item.id + ', \'quantity\', this.value)">' +
            '</td>' +
            '<td>' +
            '<input type="number" class="inv-input" style="padding:8px 10px; font-size:0.85rem; text-align:right;"' +
            ' value="' + item.price + '" min="0" step="0.01"' +
            ' oninput="updateLineItem(' + item.id + ', \'price\', this.value)">' +
            '</td>' +
            '<td style="text-align:right; font-weight:600; font-size:0.9rem;">' +
            sym + formatNumber(total) +
            '</td>' +
            '<td style="text-align:center;">' +
            '<button onclick="removeLineItem(' + item.id + ')"' +
            ' class="text-red-400 hover:text-red-600 transition p-1" title="Remove item">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
            '</td>' +
            '</tr>';
    }).join('');
}

// ─── Calculations ───
function calculateSubtotal() {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
}

function calculateTax(subtotal) {
    const rate = parseFloat(document.getElementById('inv-tax-rate').value) || 0;
    return subtotal * (rate / 100);
}

function calculateTotal(subtotal, tax) {
    return subtotal + tax;
}

// ─── Live Preview ───
function attachPreviewListeners() {
    const fields = [
        'biz-name', 'biz-address', 'biz-phone', 'biz-email', 'biz-website', 'biz-taxid',
        'client-name', 'client-address', 'client-phone', 'client-email',
        'inv-number', 'inv-date', 'inv-due-date', 'inv-currency', 'inv-tax-rate', 'inv-status',
        'inv-notes', 'inv-terms'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatePreview);
            el.addEventListener('change', updatePreview);
        }
    });
}

function updatePreview() {
    const preview = document.getElementById('invoice-preview');
    const data = getFormData();
    const currency = data.currency;
    const sym = currencySymbols[currency] || '';
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    const statusClass = 'status-' + data.status;
    const statusLabel = data.status.charAt(0).toUpperCase() + data.status.slice(1);

    let itemsHTML = '';
    if (data.items.length > 0) {
        itemsHTML = '<table style="width:100%; border-collapse:collapse; margin:16px 0;">' +
            '<thead><tr>' +
            '<th style="text-align:left; padding:8px 10px; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Description</th>' +
            '<th style="text-align:center; padding:8px 10px; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Qty</th>' +
            '<th style="text-align:right; padding:8px 10px; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Price</th>' +
            '<th style="text-align:right; padding:8px 10px; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Total</th>' +
            '</tr></thead><tbody>';

        data.items.forEach(function(item) {
            itemsHTML += '<tr>' +
                '<td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; font-size:0.82rem;">' + (escapeHtml(item.description) || '<span style="color:#ccc">\u2014</span>') + '</td>' +
                '<td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; font-size:0.82rem; text-align:center;">' + item.quantity + '</td>' +
                '<td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; font-size:0.82rem; text-align:right;">' + sym + formatNumber(item.price) + '</td>' +
                '<td style="padding:8px 10px; border-bottom:1px solid #f3f4f6; font-size:0.82rem; text-align:right; font-weight:600;">' + sym + formatNumber(item.quantity * item.price) + '</td>' +
                '</tr>';
        });

        itemsHTML += '</tbody></table>';
    } else {
        itemsHTML = '<p style="text-align:center; color:#ccc; padding:24px 0; font-size:0.85rem;">No items added</p>';
    }

    let taxHTML = '';
    if (parseFloat(data.taxRate) > 0) {
        taxHTML = '<div style="display:flex; justify-content:space-between; padding:6px 0; font-size:0.85rem;">' +
            '<span style="color:#6b7280;">Tax (' + data.taxRate + '%)</span>' +
            '<span style="font-weight:500;">' + sym + formatNumber(tax) + '</span>' +
            '</div>';
    }

    let notesHTML = '';
    if (data.notes) {
        notesHTML = '<div style="margin-top:24px; padding:12px; background:#f9fafb; border-radius:6px;">' +
            '<div style="font-family:Poppins,sans-serif; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169; margin-bottom:4px;">Notes</div>' +
            '<div style="color:#6b7280; font-size:0.8rem; white-space:pre-wrap;">' + escapeHtml(data.notes) + '</div>' +
            '</div>';
    }

    let termsHTML = '';
    if (data.terms) {
        termsHTML = '<div style="margin-top:12px; padding:12px; background:#f9fafb; border-radius:6px;">' +
            '<div style="font-family:Poppins,sans-serif; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169; margin-bottom:4px;">Terms & Conditions</div>' +
            '<div style="color:#6b7280; font-size:0.8rem; white-space:pre-wrap;">' + escapeHtml(data.terms) + '</div>' +
            '</div>';
    }

    preview.innerHTML =
        '<div style="font-family: Space Grotesk, sans-serif; color: #1a1a1a; font-size: 0.85rem;">' +
        // Header
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; padding-bottom:16px; border-bottom:3px solid #a7e169;">' +
            '<div>' +
                '<div style="font-family:Poppins,sans-serif; font-weight:700; font-size:1.4rem; color:#a7e169;">' + (escapeHtml(data.bizName) || 'ART de ONE') + '</div>' +
                (data.bizAddress ? '<div style="color:#6b7280; font-size:0.78rem; margin-top:4px;">' + escapeHtml(data.bizAddress) + '</div>' : '') +
                (data.bizPhone ? '<div style="color:#6b7280; font-size:0.78rem;">' + escapeHtml(data.bizPhone) + '</div>' : '') +
                (data.bizEmail ? '<div style="color:#6b7280; font-size:0.78rem;">' + escapeHtml(data.bizEmail) + '</div>' : '') +
                (data.bizWebsite ? '<div style="color:#6b7280; font-size:0.78rem;">' + escapeHtml(data.bizWebsite) + '</div>' : '') +
            '</div>' +
            '<div style="text-align:right;">' +
                '<div style="font-family:Poppins,sans-serif; font-size:1.6rem; font-weight:700; color:#1a1a1a;">INVOICE</div>' +
                '<span class="status-badge ' + statusClass + '">' + statusLabel + '</span>' +
            '</div>' +
        '</div>' +
        // Meta
        '<div style="display:flex; justify-content:space-between; margin-bottom:20px;">' +
            '<div>' +
                '<div style="font-family:Poppins,sans-serif; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169; margin-bottom:4px;">Bill To</div>' +
                '<div style="font-weight:600; font-size:0.9rem;">' + (escapeHtml(data.clientName) || '\u2014') + '</div>' +
                (data.clientAddress ? '<div style="color:#6b7280; font-size:0.78rem;">' + escapeHtml(data.clientAddress) + '</div>' : '') +
                (data.clientPhone ? '<div style="color:#6b7280; font-size:0.78rem;">' + escapeHtml(data.clientPhone) + '</div>' : '') +
                (data.clientEmail ? '<div style="color:#6b7280; font-size:0.78rem;">' + escapeHtml(data.clientEmail) + '</div>' : '') +
            '</div>' +
            '<div style="text-align:right;">' +
                '<div style="margin-bottom:6px;">' +
                    '<span style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169;">Invoice #</span><br>' +
                    '<span style="font-weight:600;">' + (escapeHtml(data.invNumber) || '\u2014') + '</span>' +
                '</div>' +
                '<div style="margin-bottom:6px;">' +
                    '<span style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169;">Date</span><br>' +
                    '<span>' + (data.invDate ? formatDate(data.invDate) : '\u2014') + '</span>' +
                '</div>' +
                '<div>' +
                    '<span style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169;">Due Date</span><br>' +
                    '<span>' + (data.invDueDate ? formatDate(data.invDueDate) : '\u2014') + '</span>' +
                '</div>' +
            '</div>' +
        '</div>' +
        // Items
        itemsHTML +
        // Totals
        '<div style="display:flex; justify-content:flex-end; margin-top:16px;">' +
            '<div style="width:220px;">' +
                '<div style="display:flex; justify-content:space-between; padding:6px 0; font-size:0.85rem;">' +
                    '<span style="color:#6b7280;">Subtotal</span>' +
                    '<span style="font-weight:500;">' + sym + formatNumber(subtotal) + '</span>' +
                '</div>' +
                taxHTML +
                '<div style="display:flex; justify-content:space-between; padding:10px 0 6px; font-size:1rem; font-weight:700; border-top:2px solid #1a1a1a; margin-top:8px; font-family:Poppins,sans-serif;">' +
                    '<span>Total</span>' +
                    '<span>' + sym + formatNumber(total) + '</span>' +
                '</div>' +
                '<div style="text-align:right; font-size:0.72rem; color:#9ca3af; margin-top:2px;">' + currency + '</div>' +
            '</div>' +
        '</div>' +
        notesHTML +
        termsHTML +
        // Footer
        '<div style="margin-top:28px; padding-top:14px; border-top:1px solid #e5e7eb; text-align:center; font-size:0.72rem; color:#9ca3af;">' +
            'Thank you for your business! \u2014 ' + (escapeHtml(data.bizName) || 'ART de ONE') +
        '</div>' +
        '</div>';
}

// ─── Get Form Data ───
function getFormData() {
    return {
        bizName: document.getElementById('biz-name').value,
        bizAddress: document.getElementById('biz-address').value,
        bizPhone: document.getElementById('biz-phone').value,
        bizEmail: document.getElementById('biz-email').value,
        bizWebsite: document.getElementById('biz-website').value,
        bizTaxId: document.getElementById('biz-taxid').value,
        clientName: document.getElementById('client-name').value,
        clientAddress: document.getElementById('client-address').value,
        clientPhone: document.getElementById('client-phone').value,
        clientEmail: document.getElementById('client-email').value,
        invNumber: document.getElementById('inv-number').value,
        invDate: document.getElementById('inv-date').value,
        invDueDate: document.getElementById('inv-due-date').value,
        currency: document.getElementById('inv-currency').value,
        taxRate: document.getElementById('inv-tax-rate').value,
        status: document.getElementById('inv-status').value,
        notes: document.getElementById('inv-notes').value,
        terms: document.getElementById('inv-terms').value,
        items: lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price
        }))
    };
}

// ─── Save Invoice ───
function saveInvoice() {
    const data = getFormData();
    if (!data.bizName || !data.clientName) {
        showToast('Please fill in business and client name', 'error');
        return;
    }
    if (data.items.length === 0) {
        showToast('Please add at least one item', 'error');
        return;
    }

    const invoices = JSON.parse(localStorage.getItem('ado_invoices') || '[]');
    const existingIndex = invoices.findIndex(inv => inv.invNumber === data.invNumber);

    data.subtotal = calculateSubtotal();
    data.tax = calculateTax(data.subtotal);
    data.total = calculateTotal(data.subtotal, data.tax);
    data.savedAt = new Date().toISOString();

    if (existingIndex >= 0) {
        invoices[existingIndex] = data;
        showToast('Invoice updated!', 'success');
    } else {
        invoices.unshift(data);
        showToast('Invoice saved!', 'success');
    }

    localStorage.setItem('ado_invoices', JSON.stringify(invoices));
    renderSavedInvoices();
    generateInvoiceNumber();
}

// ─── Load Invoice ───
function loadInvoice(invNumber) {
    const invoices = JSON.parse(localStorage.getItem('ado_invoices') || '[]');
    const data = invoices.find(inv => inv.invNumber === invNumber);
    if (!data) return;

    document.getElementById('biz-name').value = data.bizName || '';
    document.getElementById('biz-address').value = data.bizAddress || '';
    document.getElementById('biz-phone').value = data.bizPhone || '';
    document.getElementById('biz-email').value = data.bizEmail || '';
    document.getElementById('biz-website').value = data.bizWebsite || '';
    document.getElementById('biz-taxid').value = data.bizTaxId || '';
    document.getElementById('client-name').value = data.clientName || '';
    document.getElementById('client-address').value = data.clientAddress || '';
    document.getElementById('client-phone').value = data.clientPhone || '';
    document.getElementById('client-email').value = data.clientEmail || '';
    document.getElementById('inv-number').value = data.invNumber || '';
    document.getElementById('inv-date').value = data.invDate || '';
    document.getElementById('inv-due-date').value = data.invDueDate || '';
    document.getElementById('inv-currency').value = data.currency || 'MMK';
    document.getElementById('inv-tax-rate').value = data.taxRate || 0;
    document.getElementById('inv-status').value = data.status || 'draft';
    document.getElementById('inv-notes').value = data.notes || '';
    document.getElementById('inv-terms').value = data.terms || '';

    // Load line items
    lineItems = (data.items || []).map((item, idx) => ({
        id: idx + 1,
        description: item.description || '',
        quantity: item.quantity || 1,
        price: item.price || 0
    }));
    lineItemCounter = lineItems.length;

    renderLineItems();
    updatePreview();
    switchTab('create');
    showToast('Invoice loaded!', 'info');
}

// ─── Delete Invoice ───
function deleteInvoice(invNumber) {
    if (!confirm('Delete this invoice?')) return;
    let invoices = JSON.parse(localStorage.getItem('ado_invoices') || '[]');
    invoices = invoices.filter(inv => inv.invNumber !== invNumber);
    localStorage.setItem('ado_invoices', JSON.stringify(invoices));
    renderSavedInvoices();
    showToast('Invoice deleted', 'error');
}

// ─── Clear All ───
function clearAllInvoices() {
    if (!confirm('Delete ALL saved invoices? This cannot be undone.')) return;
    localStorage.removeItem('ado_invoices');
    renderSavedInvoices();
    showToast('All invoices cleared', 'error');
}

// ─── Render Saved Invoices ───
function renderSavedInvoices() {
    const invoices = JSON.parse(localStorage.getItem('ado_invoices') || '[]');
    const container = document.getElementById('saved-invoices-list');

    if (invoices.length === 0) {
        container.innerHTML =
            '<div class="text-center py-12 text-gray-400">' +
                '<i class="fas fa-inbox text-4xl mb-3"></i>' +
                '<p>No saved invoices yet.</p>' +
                '<p class="text-sm mt-1">Create and save your first invoice!</p>' +
            '</div>';
        return;
    }

    container.innerHTML = invoices.map(inv => {
        const sym = currencySymbols[inv.currency] || '';
        const statusClass = 'status-' + (inv.status || 'draft');
        const statusLabel = (inv.status || 'draft').charAt(0).toUpperCase() + (inv.status || 'draft').slice(1);
        const savedDate = inv.savedAt ? new Date(inv.savedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

        return '<div class="saved-invoice-item">' +
            '<div onclick="loadInvoice(\'' + escapeHtml(inv.invNumber) + '\')" style="flex:1; cursor:pointer;">' +
                '<div class="flex items-center gap-3 flex-wrap">' +
                    '<span class="font-bold text-sm" style="font-family:Poppins,sans-serif;">' + escapeHtml(inv.invNumber) + '</span>' +
                    '<span class="status-badge ' + statusClass + '">' + statusLabel + '</span>' +
                '</div>' +
                '<div class="text-sm text-gray-500 mt-1">' +
                    escapeHtml(inv.clientName || 'No client') + ' &bull; ' + sym + formatNumber(inv.total || 0) + ' ' + inv.currency +
                '</div>' +
                '<div class="text-xs text-gray-400 mt-1">' + savedDate + '</div>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
                '<button onclick="duplicateInvoice(\'' + escapeHtml(inv.invNumber) + '\')" class="p-2 text-gray-400 hover:text-emerald-500 transition" title="Duplicate">' +
                    '<i class="fas fa-copy"></i>' +
                '</button>' +
                '<button onclick="deleteInvoice(\'' + escapeHtml(inv.invNumber) + '\')" class="p-2 text-gray-400 hover:text-red-500 transition" title="Delete">' +
                    '<i class="fas fa-trash-alt"></i>' +
                '</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ─── Duplicate Invoice ───
function duplicateInvoice(invNumber) {
    const invoices = JSON.parse(localStorage.getItem('ado_invoices') || '[]');
    const original = invoices.find(inv => inv.invNumber === invNumber);
    if (!original) return;

    const newNum = 'INV-' + String(invoices.length + 1).padStart(3, '0');
    const duplicate = Object.assign({}, original, { invNumber: newNum, status: 'draft', savedAt: new Date().toISOString() });
    duplicate.items = original.items.map(item => Object.assign({}, item));

    invoices.unshift(duplicate);
    localStorage.setItem('ado_invoices', JSON.stringify(invoices));
    renderSavedInvoices();
    showToast('Invoice duplicated!', 'success');
}

// ─── Download PDF ───
function downloadPDF() {
    const data = getFormData();
    if (data.items.length === 0) {
        showToast('Add at least one item first', 'error');
        return;
    }

    showToast('Generating PDF...', 'info');

    // Create a temporary visible container for html2canvas rendering
    // Must be visible (not opacity:0 or off-screen) for html2canvas to capture it
    var tempContainer = document.createElement('div');
    tempContainer.id = 'pdf-render-temp';
    tempContainer.style.cssText = 'position:fixed; left:0; top:0; width:210mm; background:#fff; z-index:9999; padding:48px; font-family:"Space Grotesk",sans-serif; color:#1a1a1a; overflow:hidden;';
    tempContainer.innerHTML = buildPrintHTML(data);
    document.body.appendChild(tempContainer);

    // Wait for the browser to paint the container before capturing
    // This prevents the "blank white PDF" issue
    requestAnimationFrame(function() {
        setTimeout(function() {
            const opt = {
                margin: [10, 0, 10, 0],
                filename: (data.invNumber || 'invoice') + '_ARTdeONE.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(tempContainer).save().then(function() {
                if (tempContainer.parentNode) {
                    document.body.removeChild(tempContainer);
                }
                showToast('PDF downloaded!', 'success');
            }).catch(function(err) {
                if (tempContainer.parentNode) {
                    document.body.removeChild(tempContainer);
                }
                console.error('PDF generation error:', err);
                showToast('PDF generation failed', 'error');
            });
        }, 300); // 300ms delay ensures browser has rendered the content
    });
}

// ─── Print Invoice ───
function printInvoice() {
    const data = getFormData();
    const printContent = buildPrintHTML(data);

    const printWindow = window.open('', '_blank');
    var html = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<title>Invoice ' + escapeHtml(data.invNumber) + ' \u2014 ART de ONE</title>' +
        '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">' +
        '<style>' +
        '* { margin: 0; padding: 0; box-sizing: border-box; }' +
        'body { font-family: "Space Grotesk", sans-serif; color: #1a1a1a; }' +
        '@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }' +
        '</' + 'style>' +
        '</' + 'head>' +
        '<body onload="window.print();">' +
        '<div class="print-invoice" style="padding:48px; max-width:800px; margin:0 auto;">' +
        printContent +
        '</div>' +
        '</' + 'body>' +
        '</' + 'html>';
    printWindow.document.write(html);
    printWindow.document.close();
}

// ─── Build Print HTML ───
function buildPrintHTML(data) {
    const sym = currencySymbols[data.currency] || '';
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    const statusLabel = data.status.charAt(0).toUpperCase() + data.status.slice(1);

    var itemsRows = '';
    data.items.forEach(function(item) {
        itemsRows += '<tr>' +
            '<td style="padding:12px 14px; border-bottom:1px solid #f3f4f6; font-size:0.9rem;">' + (escapeHtml(item.description) || '\u2014') + '</td>' +
            '<td style="padding:12px 14px; border-bottom:1px solid #f3f4f6; font-size:0.9rem; text-align:center;">' + item.quantity + '</td>' +
            '<td style="padding:12px 14px; border-bottom:1px solid #f3f4f6; font-size:0.9rem; text-align:right;">' + sym + formatNumber(item.price) + '</td>' +
            '<td style="padding:12px 14px; border-bottom:1px solid #f3f4f6; font-size:0.9rem; text-align:right; font-weight:600;">' + sym + formatNumber(item.quantity * item.price) + '</td>' +
            '</tr>';
    });

    var taxRowHTML = '';
    if (parseFloat(data.taxRate) > 0) {
        taxRowHTML = '<div style="display:flex; justify-content:space-between; padding:8px 0; font-size:0.95rem;">' +
            '<span style="color:#6b7280;">Tax (' + data.taxRate + '%)</span>' +
            '<span style="font-weight:500;">' + sym + formatNumber(tax) + '</span>' +
            '</div>';
    }

    var notesBlock = '';
    if (data.notes) {
        notesBlock = '<div style="margin-top:32px; padding:16px; background:#f9fafb; border-radius:8px;">' +
            '<div style="font-family:Poppins,sans-serif; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169; margin-bottom:6px;">Notes</div>' +
            '<div style="color:#6b7280; font-size:0.85rem; white-space:pre-wrap;">' + escapeHtml(data.notes) + '</div>' +
            '</div>';
    }

    var termsBlock = '';
    if (data.terms) {
        termsBlock = '<div style="margin-top:12px; padding:16px; background:#f9fafb; border-radius:8px;">' +
            '<div style="font-family:Poppins,sans-serif; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169; margin-bottom:6px;">Terms & Conditions</div>' +
            '<div style="color:#6b7280; font-size:0.85rem; white-space:pre-wrap;">' + escapeHtml(data.terms) + '</div>' +
            '</div>';
    }

    return '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding-bottom:24px; border-bottom:3px solid #a7e169;">' +
        '<div>' +
            '<div style="font-family:Poppins,sans-serif; font-weight:700; font-size:1.8rem; color:#a7e169;">' + (escapeHtml(data.bizName) || 'ART de ONE') + '</div>' +
            (data.bizAddress ? '<div style="color:#6b7280; font-size:0.85rem; margin-top:6px;">' + escapeHtml(data.bizAddress) + '</div>' : '') +
            (data.bizPhone ? '<div style="color:#6b7280; font-size:0.85rem;">' + escapeHtml(data.bizPhone) + '</div>' : '') +
            (data.bizEmail ? '<div style="color:#6b7280; font-size:0.85rem;">' + escapeHtml(data.bizEmail) + '</div>' : '') +
            (data.bizWebsite ? '<div style="color:#6b7280; font-size:0.85rem;">' + escapeHtml(data.bizWebsite) + '</div>' : '') +
            (data.bizTaxId ? '<div style="color:#9ca3af; font-size:0.78rem; margin-top:4px;">Tax ID: ' + escapeHtml(data.bizTaxId) + '</div>' : '') +
        '</div>' +
        '<div style="text-align:right;">' +
            '<div style="font-family:Poppins,sans-serif; font-size:2rem; font-weight:700; color:#1a1a1a;">INVOICE</div>' +
            '<div style="font-size:0.85rem; color:#6b7280; margin-top:4px;">' + statusLabel + '</div>' +
        '</div>' +
    '</div>' +
    // Meta
    '<div style="display:flex; justify-content:space-between; margin-bottom:36px;">' +
        '<div>' +
            '<div style="font-family:Poppins,sans-serif; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169; margin-bottom:8px;">Bill To</div>' +
            '<div style="font-weight:600; font-size:1rem;">' + (escapeHtml(data.clientName) || '\u2014') + '</div>' +
            (data.clientAddress ? '<div style="color:#6b7280; font-size:0.85rem; margin-top:2px;">' + escapeHtml(data.clientAddress) + '</div>' : '') +
            (data.clientPhone ? '<div style="color:#6b7280; font-size:0.85rem;">' + escapeHtml(data.clientPhone) + '</div>' : '') +
            (data.clientEmail ? '<div style="color:#6b7280; font-size:0.85rem;">' + escapeHtml(data.clientEmail) + '</div>' : '') +
        '</div>' +
        '<div style="text-align:right;">' +
            '<div style="margin-bottom:10px;">' +
                '<div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169;">Invoice #</div>' +
                '<div style="font-weight:600; font-size:0.95rem;">' + (escapeHtml(data.invNumber) || '\u2014') + '</div>' +
            '</div>' +
            '<div style="margin-bottom:10px;">' +
                '<div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169;">Date</div>' +
                '<div style="font-size:0.95rem;">' + (data.invDate ? formatDate(data.invDate) : '\u2014') + '</div>' +
            '</div>' +
            '<div>' +
                '<div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#a7e169;">Due Date</div>' +
                '<div style="font-size:0.95rem;">' + (data.invDueDate ? formatDate(data.invDueDate) : '\u2014') + '</div>' +
            '</div>' +
        '</div>' +
    '</div>' +
    // Items Table
    '<table style="width:100%; border-collapse:collapse; margin-bottom:24px;">' +
        '<thead><tr>' +
            '<th style="text-align:left; padding:10px 14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Description</th>' +
            '<th style="text-align:center; padding:10px 14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Qty</th>' +
            '<th style="text-align:right; padding:10px 14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Unit Price</th>' +
            '<th style="text-align:right; padding:10px 14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6b7280; border-bottom:2px solid #e5e7eb;">Total</th>' +
        '</tr></thead>' +
        '<tbody>' + itemsRows + '</tbody>' +
    '</table>' +
    // Totals
    '<div style="display:flex; justify-content:flex-end;">' +
        '<div style="width:280px;">' +
            '<div style="display:flex; justify-content:space-between; padding:8px 0; font-size:0.95rem;">' +
                '<span style="color:#6b7280;">Subtotal</span>' +
                '<span style="font-weight:500;">' + sym + formatNumber(subtotal) + '</span>' +
            '</div>' +
            taxRowHTML +
            '<div style="display:flex; justify-content:space-between; padding:12px 0 8px; font-size:1.15rem; font-weight:700; border-top:2px solid #1a1a1a; margin-top:8px; font-family:Poppins,sans-serif;">' +
                '<span>Total</span>' +
                '<span>' + sym + formatNumber(total) + '</span>' +
            '</div>' +
            '<div style="text-align:right; font-size:0.75rem; color:#9ca3af;">' + data.currency + '</div>' +
        '</div>' +
    '</div>' +
    notesBlock +
    termsBlock +
    // Footer
    '<div style="margin-top:48px; padding-top:20px; border-top:1px solid #e5e7eb; text-align:center; font-size:0.8rem; color:#9ca3af;">' +
        'Thank you for your business! \u2014 ' + (escapeHtml(data.bizName) || 'ART de ONE') +
    '</div>';
}

// ─── Reset Form ───
function resetForm() {
    if (!confirm('Reset all fields? This will clear everything.')) return;

    document.getElementById('biz-name').value = 'ART de ONE';
    document.getElementById('biz-address').value = 'Yangon, Myanmar';
    document.getElementById('biz-phone').value = '';
    document.getElementById('biz-email').value = '';
    document.getElementById('biz-website').value = 'www.artdeone.com';
    document.getElementById('biz-taxid').value = '';
    document.getElementById('client-name').value = '';
    document.getElementById('client-address').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('inv-currency').value = 'MMK';
    document.getElementById('inv-tax-rate').value = '0';
    document.getElementById('inv-status').value = 'draft';
    document.getElementById('inv-notes').value = '';
    document.getElementById('inv-terms').value = '';

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('inv-date').value = formatDateInput(today);
    document.getElementById('inv-due-date').value = formatDateInput(dueDate);

    lineItems = [];
    lineItemCounter = 0;
    addLineItem();
    generateInvoiceNumber();
    updatePreview();
    showToast('Form reset', 'info');
}

// ─── Tab Switching ───
function switchTab(tab) {
    document.getElementById('panel-create').classList.toggle('hidden', tab !== 'create');
    document.getElementById('panel-saved').classList.toggle('hidden', tab !== 'saved');
    document.getElementById('tab-create').classList.toggle('active', tab === 'create');
    document.getElementById('tab-saved').classList.toggle('active', tab === 'saved');

    if (tab === 'saved') {
        renderSavedInvoices();
    }
}

// ─── Theme Toggle ───
function toggleTheme() {
    // Use the existing ADOThemeMode API if available
    if (window.ADOThemeMode) {
        const currentMode = window.ADOThemeMode.getMode();
        const resolved = document.body.classList.contains('dark-mode');
        if (currentMode === 'system') {
            window.ADOThemeMode.setMode(resolved ? 'light' : 'dark');
        } else {
            window.ADOThemeMode.setMode(resolved ? 'light' : 'dark');
        }
    } else {
        // Fallback: manual toggle
        const body = document.body;
        const html = document.documentElement;
        body.classList.toggle('dark-mode');
        html.setAttribute('data-theme', body.classList.contains('dark-mode') ? 'dark' : 'light');

        const css = document.getElementById('ado-dark-mode-css');
        if (css) css.disabled = !body.classList.contains('dark-mode');

        localStorage.setItem('ado-theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    const isDark = document.body.classList.contains('dark-mode');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-gray-500';
    }
}

// ─── Toast ───
function showToast(message, type) {
    type = type || 'success';
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast toast-' + type + ' show';
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// ─── Utilities ───
function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
    if (!dateStr) return '\u2014';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
