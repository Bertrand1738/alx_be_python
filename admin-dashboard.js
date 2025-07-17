import { query } from 'wix-data';
import { getUploadStats, decryptImage } from 'backend/uploadHandler';

let currentPage = 1;
const itemsPerPage = 10;

$w.onReady(() => {
  // Initialize dashboard
  loadUploadLogs();
  loadStatistics();
  
  // Set up event handlers
  $w("#refreshButton").onClick(loadUploadLogs);
  $w("#statsButton").onClick(loadStatistics);
  $w("#prevButton").onClick(previousPage);
  $w("#nextButton").onClick(nextPage);
  $w("#searchButton").onClick(searchUploads);
  
  // Auto-refresh every 30 seconds
  setInterval(loadUploadLogs, 30000);
});

async function loadUploadLogs() {
  try {
    $w("#statusText").text = "Loading upload logs...";
    
    const skip = (currentPage - 1) * itemsPerPage;
    
    const results = await query("UploadLogs")
      .descending("uploadTime")
      .skip(skip)
      .limit(itemsPerPage)
      .find();
    
    displayUploads(results.items);
    updatePagination(results.totalCount);
    
    $w("#statusText").text = `Showing ${results.items.length} of ${results.totalCount} uploads`;
    
  } catch (error) {
    console.error("Error loading logs:", error);
    $w("#statusText").text = "Error loading upload logs";
  }
}

async function loadStatistics() {
  try {
    const stats = await getUploadStats();
    
    if (stats.success) {
      let statsText = "📊 Upload Statistics:\n";
      stats.stats.forEach(stat => {
        statsText += `${stat._id}: ${stat.count}\n`;
      });
      $w("#statsDisplay").text = statsText;
    }
  } catch (error) {
    console.error("Error loading stats:", error);
    $w("#statsDisplay").text = "Error loading statistics";
  }
}

function displayUploads(uploads) {
  let html = `
    <div class="upload-logs">
      <table class="logs-table">
        <thead>
          <tr>
            <th>File ID</th>
            <th>Original Name</th>
            <th>User Email</th>
            <th>Upload Time</th>
            <th>Status</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  uploads.forEach(upload => {
    const uploadTime = new Date(upload.uploadTime).toLocaleString();
    const fileSize = upload.originalSize ? formatFileSize(upload.originalSize) : 'N/A';
    const status = upload.status === 'uploaded' ? '✅ Success' : '❌ Failed';
    
    html += `
      <tr class="${upload.status}">
        <td><code>${upload.fileId || 'N/A'}</code></td>
        <td>${upload.fileName}</td>
        <td>${upload.userEmail}</td>
        <td>${uploadTime}</td>
        <td>${status}</td>
        <td>${fileSize}</td>
        <td>
          ${upload.status === 'uploaded' ? 
            `<button class="view-btn" data-file-id="${upload.fileId}">View</button>
             <button class="download-btn" data-file-id="${upload.fileId}">Download</button>` 
            : 'N/A'
          }
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    
    <style>
      .upload-logs {
        margin: 20px 0;
      }
      
      .logs-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .logs-table th,
      .logs-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      
      .logs-table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
      }
      
      .logs-table tr:hover {
        background: #f8f9fa;
      }
      
      .uploaded {
        background: #f8fff8;
      }
      
      .failed {
        background: #fff8f8;
      }
      
      .view-btn,
      .download-btn {
        padding: 6px 12px;
        margin: 2px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .view-btn {
        background: #007bff;
        color: white;
      }
      
      .download-btn {
        background: #28a745;
        color: white;
      }
      
      code {
        background: #f1f3f4;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 11px;
      }
    </style>
  `;
  
  $w("#logsDisplay").html = html;
  
  // Add click handlers for action buttons
  setTimeout(() => {
    const viewButtons = document.querySelectorAll('.view-btn');
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const fileId = e.target.getAttribute('data-file-id');
        viewFile(fileId);
      });
    });
    
    downloadButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const fileId = e.target.getAttribute('data-file-id');
        downloadFile(fileId);
      });
    });
  }, 100);
}

async function viewFile(fileId) {
  try {
    $w("#statusText").text = "Loading file preview...";
    
    // Get decryption key (in production, this should be properly secured)
    const decryptionKey = "secure-shared-key-2024"; // Same as frontend
    
    const result = await decryptImage(fileId, decryptionKey);
    
    if (result.success) {
      // Display image in modal or new window
      const imageData = `data:${result.mimeType};base64,${result.data}`;
      
      // Create modal HTML
      const modalHtml = `
        <div class="modal-overlay" onclick="closeModal()">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3>${result.filename}</h3>
              <button onclick="closeModal()" class="close-btn">×</button>
            </div>
            <div class="modal-body">
              <img src="${imageData}" style="max-width: 100%; max-height: 70vh; object-fit: contain;" />
            </div>
          </div>
        </div>
        
        <style>
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
          }
          
          .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .modal-body {
            padding: 20px;
            text-align: center;
          }
          
          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          }
        </style>
        
        <script>
          function closeModal() {
            document.querySelector('.modal-overlay').remove();
          }
        </script>
      `;
      
      // Add modal to page
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      $w("#statusText").text = `File ${fileId} loaded successfully`;
    }
  } catch (error) {
    console.error("Error viewing file:", error);
    $w("#statusText").text = "Error loading file preview";
  }
}

async function downloadFile(fileId) {
  try {
    $w("#statusText").text = "Preparing download...";
    
    const decryptionKey = "secure-shared-key-2024";
    const result = await decryptImage(fileId, decryptionKey);
    
    if (result.success) {
      const imageData = `data:${result.mimeType};base64,${result.data}`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = imageData;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      $w("#statusText").text = `File ${result.filename} downloaded`;
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    $w("#statusText").text = "Error downloading file";
  }
}

async function searchUploads() {
  const searchTerm = $w("#searchInput").value;
  
  if (!searchTerm) {
    loadUploadLogs();
    return;
  }
  
  try {
    const results = await query("UploadLogs")
      .or(
        query("UploadLogs").contains("fileName", searchTerm),
        query("UploadLogs").contains("userEmail", searchTerm),
        query("UploadLogs").contains("fileId", searchTerm)
      )
      .descending("uploadTime")
      .find();
    
    displayUploads(results.items);
    $w("#statusText").text = `Found ${results.items.length} matching uploads`;
    
  } catch (error) {
    console.error("Search error:", error);
    $w("#statusText").text = "Error searching uploads";
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updatePagination(totalCount) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  $w("#prevButton").enable();
  $w("#nextButton").enable();
  
  if (currentPage <= 1) {
    $w("#prevButton").disable();
  }
  
  if (currentPage >= totalPages) {
    $w("#nextButton").disable();
  }
  
  $w("#pageInfo").text = `Page ${currentPage} of ${totalPages}`;
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    loadUploadLogs();
  }
}

function nextPage() {
  currentPage++;
  loadUploadLogs();
}