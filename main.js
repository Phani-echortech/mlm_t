// Keep the existing JavaScript code but update these specific functions:

function updateTransactions(transactions) {
    const list = document.getElementById('transactionsList');
    list.innerHTML = '';

    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-monospace">${tx.id}</td>
            <td>${tx.sponsorId}</td>
            <td class="text-success">$${tx.directCommission.toFixed(2)}</td>
            <td class="text-primary">$${tx.differenceIncome.toFixed(2)}</td>
            <td class="text-info">$${tx.levelIncentives.toFixed(2)}</td>
            <td class="fw-bold">$${tx.totalCommission.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary details-btn" data-transaction-id="${tx.id}">
                    <i class="bi bi-info-circle me-1"></i>Details
                </button>
            </td>
        `;
        
        const detailsBtn = row.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            showCommissionBreakdown(tx.id);
        });
        
        list.appendChild(row);
    });
}

function showTransactionModal(transaction) {
    if (!transaction) {
        displayError('Transaction details not found');
        return;
    }
    
    const detailsDiv = document.getElementById('transactionDetails');
    
    let breakdownHtml = `
        <div class="mb-4">
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">Sponsor</h6>
                            <p class="card-text fw-bold">${transaction.sponsorId}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">Total Commission</h6>
                            <p class="card-text fw-bold text-success">$${transaction.totalCommission.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <h6 class="mb-3">Commission Breakdown</h6>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Type</th>
                        <th class="text-end">Amount</th>
                    </tr>
                </thead>
                <tbody>`;

    if (transaction.commissionsBreakdown && transaction.commissionsBreakdown.length > 0) {
        transaction.commissionsBreakdown.forEach(comm => {
            breakdownHtml += `
                <tr>
                    <td>${comm.userId}</td>
                    <td>${getCommissionTypeDescription(comm)}</td>
                    <td class="text-end fw-bold text-success">$${comm.amount.toFixed(2)}</td>
                </tr>
            `;
        });
    } else {
        breakdownHtml += `
            <tr>
                <td colspan="3" class="text-center text-muted">No commission details available</td>
            </tr>
        `;
    }

    breakdownHtml += `
                </tbody>
            </table>
        </div>
    `;

    detailsDiv.innerHTML = breakdownHtml;
    
    // Use Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
    modal.show();
}

function displayValidationUpdates(updates) {
    const validationResults = document.getElementById('validationResults');
    if (updates.length === 0) {
        validationResults.innerHTML = `
            <div class="alert alert-success" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                Network validation successful. All users meet their tier requirements.
            </div>
        `;
        return;
    }

    const updatesList = updates.map(update => `
        <li class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
                <span>${update.userId}</span>
                <span class="badge bg-primary">
                    T${update.oldTier} → T${update.newTier}
                </span>
            </div>
            <small class="text-muted">
                DR: ${update.directReferrals}, TS: ${update.teamSize}
            </small>
        </li>
    `).join('');

    validationResults.innerHTML = `
        <div class="alert alert-warning mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Tier updates required for some users
        </div>
        <ul class="list-group">
            ${updatesList}
        </ul>
    `;
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 end-0 m-3';
    errorDiv.innerHTML = `
        <i class="bi bi-exclamation-circle-fill me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(errorDiv);
        alert.close();
    }, 5000);
}