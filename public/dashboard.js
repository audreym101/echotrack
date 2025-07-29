// Dashboard Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let currentUser = null;
let currentView = 'overview';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadOverview();
});

// Initialize Dashboard
function initializeDashboard() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserData();
    
    // Setup navigation
    setupNavigation();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const view = this.dataset.view;
            loadView(view);
        });
    });

    // Form submissions
    document.getElementById('donationForm').addEventListener('submit', handleDonationSubmit);
    document.getElementById('jobForm').addEventListener('submit', handleJobSubmit);
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordSubmit);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Load User Data
async function loadUserData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            // For demo purposes, use the first user
            if (users.length > 0) {
                currentUser = users[0];
                updateUserInterface();
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    } finally {
        hideLoading();
    }
}

// Update User Interface
function updateUserInterface() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userInfo').textContent = `${currentUser.name} (${currentUser.role})`;
        
        // Update profile form
        document.getElementById('profileName').value = currentUser.name;
        document.getElementById('profileEmail').value = currentUser.email;
    }
}

// Setup Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

// Load View
function loadView(view) {
    currentView = view;
    
    // Hide all views
    document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
    
    // Show selected view
    const selectedView = document.getElementById(view);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        'overview': 'Dashboard Overview',
        'donations': 'Donations Management',
        'jobs': 'Jobs Management',
        'users': 'User Management',
        'reports': 'Reports & Analytics',
        'settings': 'Settings'
    };
    pageTitle.textContent = titles[view] || 'Dashboard';
    
    // Load view-specific data
  switch(view) {
        case 'overview':
            loadOverview();
            break;
        case 'donations':
            loadDonations();
      break;
        case 'jobs':
            loadJobs();
      break;
        case 'users':
            loadUsers();
      break;
        case 'reports':
            loadReports();
      break;
    }
}

// Load Overview Data
async function loadOverview() {
    try {
        showLoading();
        
        // Load statistics
        await Promise.all([
            loadDonationsStats(),
            loadJobsStats(),
            loadUsersStats(),
            loadRecentDonations(),
            loadRecentJobs()
        ]);
        
    } catch (error) {
        console.error('Error loading overview:', error);
        showNotification('Error loading overview data', 'error');
    } finally {
        hideLoading();
    }
}

// Load Donations Statistics
async function loadDonationsStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/donations`);
        if (response.ok) {
            const donations = await response.json();
            const totalAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
            
            document.getElementById('totalDonations').textContent = donations.length;
            document.getElementById('totalAmount').textContent = `$${totalAmount.toLocaleString()}`;
        }
    } catch (error) {
        console.error('Error loading donations stats:', error);
    }
}

// Load Jobs Statistics
async function loadJobsStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (response.ok) {
            const jobs = await response.json();
            const activeJobs = jobs.filter(job => job.status === 'active');
            
            document.getElementById('activeJobs').textContent = activeJobs.length;
        }
    } catch (error) {
        console.error('Error loading jobs stats:', error);
    }
}

// Load Users Statistics
async function loadUsersStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (response.ok) {
            const users = await response.json();
            document.getElementById('totalUsers').textContent = users.length;
        }
    } catch (error) {
        console.error('Error loading users stats:', error);
    }
}

// Load Recent Donations
async function loadRecentDonations() {
    try {
        const response = await fetch(`${API_BASE_URL}/donations`);
        if (response.ok) {
            const donations = await response.json();
            const recentDonations = donations.slice(0, 5);
            
            const container = document.getElementById('recentDonationsList');
            if (recentDonations.length === 0) {
                container.innerHTML = '<p>No donations yet</p>';
                return;
            }
            
            container.innerHTML = recentDonations.map(donation => `
                <div class="list-item">
                    <div class="list-item-left">
                        <h4>$${donation.amount} ${donation.currency}</h4>
                        <p>${donation.donor?.name || 'Anonymous'} • ${new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="list-item-right">
                        <span class="status ${donation.status}">${donation.status}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading recent donations:', error);
    }
}

// Load Recent Jobs
async function loadRecentJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (response.ok) {
            const jobs = await response.json();
            const recentJobs = jobs.slice(0, 5);
            
            const container = document.getElementById('recentJobsList');
            if (recentJobs.length === 0) {
                container.innerHTML = '<p>No jobs posted yet</p>';
                return;
            }
            
            container.innerHTML = recentJobs.map(job => `
                <div class="list-item">
                    <div class="list-item-left">
                        <h4>${job.title}</h4>
                        <p>${job.postedBy?.name || 'Unknown'} • ${new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="list-item-right">
                        <span class="status ${job.status}">${job.status}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading recent jobs:', error);
    }
}

// Load Donations
async function loadDonations() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/donations`);
        
        if (response.ok) {
            const donations = await response.json();
            displayDonationsTable(donations);
        } else {
            throw new Error('Failed to load donations');
        }
    } catch (error) {
        console.error('Error loading donations:', error);
        showNotification('Error loading donations', 'error');
    } finally {
        hideLoading();
    }
}

// Display Donations Table
function displayDonationsTable(donations) {
    const container = document.getElementById('donationsList');
    
    if (donations.length === 0) {
        container.innerHTML = '<p>No donations found</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Donor</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${donations.map(donation => `
                    <tr>
                        <td>${donation.donor?.name || 'Anonymous'}</td>
                        <td>$${donation.amount}</td>
                        <td>${donation.currency}</td>
                        <td><span class="status ${donation.status}">${donation.status}</span></td>
                        <td>${new Date(donation.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button class="btn-primary" onclick="viewDonation('${donation._id}')">View</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Load Jobs
async function loadJobs() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/jobs`);
        
        if (response.ok) {
            const jobs = await response.json();
            displayJobsTable(jobs);
        } else {
            throw new Error('Failed to load jobs');
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        showNotification('Error loading jobs', 'error');
    } finally {
        hideLoading();
    }
}

// Display Jobs Table
function displayJobsTable(jobs) {
    const container = document.getElementById('jobsList');
    
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Posted By</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${jobs.map(job => `
                    <tr>
                        <td>${job.title}</td>
                        <td>${job.postedBy?.name || 'Unknown'}</td>
                        <td><span class="status ${job.status}">${job.status}</span></td>
                        <td>${new Date(job.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button class="btn-primary" onclick="viewJob('${job._id}')">View</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Load Users
async function loadUsers() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/users`);
        
        if (response.ok) {
            const users = await response.json();
            displayUsersTable(users);
        } else {
            throw new Error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading users', 'error');
    } finally {
        hideLoading();
    }
}

// Display Users Table
function displayUsersTable(users) {
    const container = document.getElementById('usersList');
    
    if (users.length === 0) {
        container.innerHTML = '<p>No users found</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Age</th>
                    <th>Joined</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td><span class="status">${user.role}</span></td>
                        <td>${user.age || 'N/A'}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button class="btn-primary" onclick="viewUser('${user._id}')">View</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Load Reports
function loadReports() {
    // Placeholder for reports functionality
    console.log('Loading reports...');
}

// Modal Functions
function showDonationModal() {
    document.getElementById('donationModal').style.display = 'block';
}

function showJobModal() {
    document.getElementById('jobModal').style.display = 'block';
}

function showUserModal() {
    document.getElementById('userModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Form Handlers
async function handleDonationSubmit(event) {
    event.preventDefault();
    
    const formData = {
        amount: parseFloat(document.getElementById('donationAmount').value),
        currency: document.getElementById('donationCurrency').value,
        description: document.getElementById('donationDescription').value,
        donor: currentUser?._id
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Donation submitted successfully!', 'success');
            closeModal('donationModal');
            event.target.reset();
            loadOverview();
        } else {
            throw new Error('Failed to submit donation');
        }
    } catch (error) {
        console.error('Error submitting donation:', error);
        showNotification('Error submitting donation', 'error');
    }
}

async function handleJobSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('jobTitle').value,
        description: document.getElementById('jobDescription').value,
        salary: document.getElementById('jobSalary').value,
        location: document.getElementById('jobLocation').value,
        postedBy: currentUser?._id,
        status: 'active'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Job posted successfully!', 'success');
            closeModal('jobModal');
            event.target.reset();
            loadJobs();
        } else {
            throw new Error('Failed to post job');
        }
    } catch (error) {
        console.error('Error posting job:', error);
        showNotification('Error posting job', 'error');
    }
}

async function handleUserSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('userNameInput').value,
        email: document.getElementById('userEmailInput').value,
        password: document.getElementById('userPasswordInput').value,
        role: document.getElementById('userRoleInput').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('User created successfully!', 'success');
            closeModal('userModal');
            event.target.reset();
            loadUsers();
        } else {
            throw new Error('Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification('Error creating user', 'error');
    }
}

async function handleProfileSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Profile updated successfully!', 'success');
            loadUserData();
        } else {
            throw new Error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    }
}

async function handlePasswordSubmit(event) {
    event.preventDefault();
    
    const formData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Password changed successfully!', 'success');
            event.target.reset();
        } else {
            throw new Error('Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Error changing password', 'error');
    }
}

// Utility Functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// View Functions
function viewDonation(id) {
    showNotification(`Viewing donation ${id}`, 'info');
}

function viewJob(id) {
    showNotification(`Viewing job ${id}`, 'info');
}

function viewUser(id) {
    showNotification(`Viewing user ${id}`, 'info');
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
