import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaHeart,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaDollarSign,
  FaUsers,
  FaMapMarkerAlt,
  FaChartLine,
  FaReceipt,
  FaCheckCircle,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { donationsService } from "../services/donationsService";
import { useLocalization } from "../contexts/LocalizationContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatReceiptDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const Receipt = ({ donation, impact, onClose }) => {
  const receiptRef = useRef();
  const { t } = useLocalization();

  const downloadPDF = async () => {
    const receipt = receiptRef.current;
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "210mm";
    tempContainer.style.padding = "20mm";
    tempContainer.style.backgroundColor = "#ffffff";
    tempContainer.style.boxSizing = "border-box";

    const receiptClone = receipt.cloneNode(true);
    receiptClone.style.width = "100%";
    receiptClone.style.maxWidth = "none";
    receiptClone.style.padding = "0";
    receiptClone.style.margin = "0";
    receiptClone.style.boxShadow = "none";
    receiptClone.style.border = "none";

    const actionButtons = receiptClone.querySelectorAll(".no-print");
    actionButtons.forEach((btn) => btn.remove());

    tempContainer.appendChild(receiptClone);
    document.body.appendChild(tempContainer);

    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgWidthFinal = imgWidth * ratio;
      const imgHeightFinal = imgHeight * ratio;

      const x = (pdfWidth - imgWidthFinal) / 2;
      const y = (pdfHeight - imgHeightFinal) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidthFinal, imgHeightFinal);
      pdf.save(`donation-receipt-${donation.id.substring(0, 8)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      const pdf = new jsPDF();
      pdf.text(`Donation Receipt - ${donation.id}`, 10, 10);
      pdf.text(`Amount: ${donation.amount} ETB`, 10, 20);
      pdf.text(`Date: ${formatReceiptDate(donation.date)}`, 10, 30);
      pdf.save(`donation-receipt-${donation.id}.pdf`);
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const printReceipt = () => {
    const printWindow = window.open("", "_blank");

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt - ${donation.tx_ref}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              background: #ffffff;
              color: #111827;
              line-height: 1.5;
              padding: 20mm;
              min-height: 100vh;
            }
            
            .receipt-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 8mm;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              background: white;
            }
            
            .receipt-header {
              text-align: center;
              margin-bottom: 12mm;
              padding-bottom: 6mm;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .organization-logo {
              width: 60px;
              height: 60px;
              background: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 4mm;
            }
            
            .organization-name {
              font-size: 28px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 2mm;
            }
            
            .organization-tagline {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 1mm;
            }
            
            .organization-contact {
              color: #9ca3af;
              font-size: 14px;
            }
            
            .receipt-details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8mm;
              margin-bottom: 8mm;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 4mm;
            }
            
            .detail-item {
              margin-bottom: 3mm;
            }
            
            .detail-label {
              font-size: 14px;
              color: #6b7280;
              display: block;
              margin-bottom: 1mm;
            }
            
            .detail-value {
              font-size: 16px;
              font-weight: 500;
              color: #111827;
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              padding: 2px 8px;
              background: #d1fae5;
              color: #065f46;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .amount-section {
              background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%);
              padding: 8mm;
              border-radius: 12px;
              text-align: center;
              margin-bottom: 8mm;
            }
            
            .amount-label {
              font-size: 16px;
              color: #6b7280;
              margin-bottom: 2mm;
            }
            
            .amount-value {
              font-size: 40px;
              font-weight: 700;
              color: #059669;
              margin-bottom: 2mm;
            }
            
            .impact-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 4mm;
              margin-bottom: 8mm;
              padding: 6mm;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
            }
            
            .impact-item {
              text-align: center;
              padding: 4mm;
              background: #f9fafb;
              border-radius: 8px;
            }
            
            .impact-icon {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 2mm;
              border-radius: 8px;
            }
            
            .impact-count {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 1mm;
            }
            
            .impact-label {
              font-size: 14px;
              color: #6b7280;
            }
            
            .tax-notice {
              background: #fffbeb;
              border: 1px solid #fbbf24;
              border-radius: 8px;
              padding: 4mm;
              text-align: center;
              margin-bottom: 8mm;
              font-size: 14px;
              color: #92400e;
            }
            
            .receipt-footer {
              text-align: center;
              padding-top: 6mm;
              border-top: 1px solid #e5e7eb;
              position: relative;
            }
            
            .qrcode {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 48px;
              height: 48px;
            }
            
            .footer-text {
              font-size: 14px;
              color: #6b7280;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .receipt-container {
                border: none;
                border-radius: 0;
                padding: 0;
                max-width: 100%;
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header -->
            <div class="receipt-header">
              <div class="organization-logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h1 class="organization-name">AfarAid</h1>
              <p class="organization-tagline">Transforming Lives Through Sustainable Giving</p>
              <p class="organization-contact">123 Charity Street, Addis Ababa, Ethiopia | +251 123 456 789</p>
            </div>

            <!-- Details Grid -->
            <div class="receipt-details-grid">
              <div>
                <h3 class="section-title">Donation Details</h3>
                <div class="detail-item">
                  <span class="detail-label">Receipt Number</span>
                  <span class="detail-value">${donation.tx_ref}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date & Time</span>
                  <span class="detail-value">${formatReceiptDate(
                    donation.date
                  )}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Campaign</span>
                  <span class="detail-value">${donation.campaignTitle}</span>
                </div>
              </div>
              
              <div>
                <h3 class="section-title">Donor Information</h3>
                <div class="detail-item">
                  <span class="detail-label">Donor ID</span>
                  <span class="detail-value">${
                    donation.donorIdentityNumber
                  }</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">${
                    donation.paymentMethod || "Credit Card"
                  }</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="status-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    ${donation.status || "Completed"}
                  </span>
                </div>
              </div>
            </div>

            <!-- Amount Section -->
            <div class="amount-section">
              <p class="amount-label">Donation Amount</p>
              <p class="amount-value">${donation.amount} ETB</p>
              <p class="detail-value">Thank you! Your contribution makes a difference.</p>
            </div>

            <!-- Impact Summary -->
            <div class="impact-grid">
              <div class="impact-item">
                <div class="impact-icon" style="background: #d1fae5;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#059669">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <p class="impact-count">${impact.familiesHelped}</p>
                <p class="impact-label">Families Helped</p>
              </div>
              
              <div class="impact-item">
                <div class="impact-icon" style="background: #dbeafe;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2563eb">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <p class="impact-count">${impact.goatsProvided}</p>
                <p class="impact-label">Goats Provided</p>
              </div>
              
              <div class="impact-item">
                <div class="impact-icon" style="background: #f3e8ff;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#7c3aed">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p class="impact-count">${impact.communitiesReached}</p>
                <p class="impact-label">Communities Reached</p>
              </div>
            </div>

            <!-- Tax Notice -->
            <div class="tax-notice">
              <strong>Tax Deductible:</strong> This receipt may be used for tax purposes. 
              AfarAid is a registered 501(c)(3) nonprofit organization. Tax ID: 12-3456789
            </div>

            <!-- Footer -->
            <div class="receipt-footer">
              <div class="qrcode">
                <!-- Simple QR code SVG as fallback -->
                <svg viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="white"/>
                  <rect x="2" y="2" width="6" height="6" fill="#374151"/>
                  <rect x="40" y="2" width="6" height="6" fill="#374151"/>
                  <rect x="2" y="40" width="6" height="6" fill="#374151"/>
                  <!-- Simple QR pattern -->
                  <rect x="12" y="12" width="4" height="4" fill="#374151"/>
                  <rect x="32" y="12" width="4" height="4" fill="#374151"/>
                  <rect x="12" y="32" width="4" height="4" fill="#374151"/>
                </svg>
              </div>
              <p class="footer-text">Questions? Contact us at support@AfarAid.org</p>
              <p class="footer-text">Receipt generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <script>
            // Auto-print and close
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Donation Receipt</h2>
              <p className="text-green-100">Official Tax-Deductible Receipt</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div
              ref={receiptRef}
              className="bg-white p-8 border-2 border-gray-200 rounded-xl"
            >
              <div className="text-center mb-8 border-b-2 border-gray-100 pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  AfarAid
                </h1>
                <p className="text-gray-600">
                  Transforming Lives Through Sustainable Giving
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  123 Charity Street, Addis Ababa, Ethiopia | +251 123 456 789
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Donation Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Receipt Number</p>
                      <p className="font-semibold">{donation.tx_ref}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-semibold">
                        {formatReceiptDate(donation.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Campaign</p>
                      <p className="font-semibold">{donation.campaignTitle}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Donor Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Donor ID</p>
                      <p className="font-semibold">
                        {donation.donorIdentityNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-semibold">
                        {donation.paymentMethod || "Credit Card"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="h-3 w-3 mr-1" />
                        {donation.status || "Completed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Donation Amount</p>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {donation.amount} ETB
                  </p>
                  <p className="text-gray-600">
                    {t("dashboard.thankYou")} Your contribution makes a
                    difference.
                  </p>
                </div>
              </div>

              <div className="border-2 border-gray-100 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Impact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FaUsers className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Families Helped</p>
                    <p className="font-bold text-gray-900">
                      {impact.familiesHelped}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FaHeart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Goats Provided</p>
                    <p className="font-bold text-gray-900">
                      {impact.goatsProvided}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FaMapMarkerAlt className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Communities</p>
                    <p className="font-bold text-gray-900">
                      {impact.communitiesReached}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-sm text-yellow-800">
                  <strong>Tax Deductible:</strong> This receipt may be used for
                  tax purposes. AfarAid is a registered 501(c)(3) nonprofit
                  organization. Tax ID: 12-3456789
                </p>
              </div>

              <div className="text-center mt-8 pt-6 border-t border-gray-200 relative">
                <p className="text-sm text-gray-500">
                  Questions? Contact us at support@AfarAid.org
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Receipt generated on {new Date().toLocaleDateString()}
                </p>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-4">
                  <QRCodeSVG
                    value={`https://afaraid.org/receipt/${donation.id}`}
                    size={48}
                    level="M"
                    includeMargin={false}
                    fgColor="#374151"
                    bgColor="#ffffff"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex-1"
              >
                <FaFilePdf className="h-4 w-4" />
                <span>Download as PDF</span>
              </button>
              <button
                onClick={printReceipt}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex-1"
              >
                <FaPrint className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DonationCard = ({ donation, onDownloadReceipt }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {donation.campaignTitle}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FaCalendarAlt className="h-4 w-4 mr-2" />
          <span>{formatDate(donation.date)}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-green-600">
          {donation.amount} ETB
        </p>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {donation.status}
        </span>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
        <FaEye className="h-4 w-4" />
        <span className="text-sm">View Campaign</span>
      </button>
      <button
        onClick={() => onDownloadReceipt(donation)}
        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
      >
        <FaDownload className="h-4 w-4" />
        <span className="text-sm">Download Receipt</span>
      </button>
    </div>
  </motion.div>
);

const DonorDashboard = () => {
  const { t } = useLocalization();
  const { donorIdentityNumber } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [impact, setImpact] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [donorData, setDonorData] = useState({
    totalDonated: 0,
    totalDonations: 0,
    campaignsSupported: 0,
    lastDonation: null,
    donations: [],
    impact: { familiesHelped: 0, goatsProvided: 0, communitiesReached: 0 },
  });

  const fetchDonorDashboard = useCallback(async () => {
    if (!donorIdentityNumber) return;

    try {
      setLoading(true);
      setError(null);

      const data = await donationsService.getDonorDashboard(
        donorIdentityNumber
      );
      console.log("Fetched donor dashboard data:", data);
      setDonorData({
        totalDonated: data.totalDonated,
        totalDonations: data.totalDonations,
        campaignsSupported: data.campaignsSupported,
        lastDonation: data.lastDonation,
        donations: data.donations,
        impact: data.impact,
      });
    } catch (err) {
      setError(
        err.message || t("dashboard.error") || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, [donorIdentityNumber, t]);

  useEffect(() => {
    fetchDonorDashboard();
  }, [fetchDonorDashboard]);

  const handleDownloadReceipt = (donation) => {
    setSelectedDonation(donation);
    setImpact(donorData.impact);
    setShowReceipt(true);
  };

  const tabs = [
    { id: "overview", name: t("dashboard.overview"), icon: FaChartLine },
    { id: "donations", name: t("dashboard.myDonations"), icon: FaReceipt },
    { id: "impact", name: t("dashboard.myImpact"), icon: FaHeart },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t("common.loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t("dashboard.title")}
            </h1>
            <p className="text-xl text-gray-600">{t("dashboard.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {t("dashboard.totalDonated")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donorData.totalDonated.toLocaleString()} ETB
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {t("dashboard.totalDonations")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donorData.totalDonations}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaHeart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {t("dashboard.campaigns")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donorData.campaignsSupported}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {t("dashboard.lastDonation")}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {donorData.lastDonation
                      ? formatDate(donorData.lastDonation)
                      : "-"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {t("dashboard.recentDonations")}
                      </h3>
                      <div className="space-y-4">
                        {donorData.donations.slice(0, 3).map((donation) => (
                          <div
                            key={donation.id}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {donation.campaignTitle}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(donation.date)}
                              </p>
                            </div>
                            <p className="font-semibold text-green-600">
                              {donation.amount} ETB
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {t("dashboard.yourImpact")}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FaUsers className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-gray-900">
                              {t("dashboard.familiesHelped")}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-green-600">
                            {donorData.impact.familiesHelped}
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FaHeart className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              {t("dashboard.goatsProvided")}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-blue-600">
                            {donorData.impact.goatsProvided}
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FaMapMarkerAlt className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-gray-900">
                              {t("dashboard.communities")}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-purple-600">
                            {donorData.impact.communitiesReached}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "donations" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-6">
                    {donorData.donations.map((donation) => (
                      <DonationCard
                        key={donation.id}
                        donation={donation}
                        onDownloadReceipt={handleDownloadReceipt}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "impact" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {t("dashboard.impactStory")}
                    </h3>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                      {t("dashboard.impactDescription")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUsers className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 mb-2">
                        {donorData.impact.familiesHelped}
                      </h4>
                      <p className="text-gray-600">
                        {t("dashboard.familiesDirectlyHelped")}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {t("dashboard.familiesDesc", {
                          count: donorData.impact.familiesHelped,
                        })}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHeart className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 mb-2">
                        {donorData.impact.goatsProvided}
                      </h4>
                      <p className="text-gray-600">
                        {t("dashboard.goatsProvided")}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {t("dashboard.goatsDesc", {
                          count: donorData.impact.goatsProvided,
                        })}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaMapMarkerAlt className="h-8 w-8 text-purple-600" />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 mb-2">
                        {donorData.impact.communitiesReached}
                      </h4>
                      <p className="text-gray-600">
                        {t("dashboard.communitiesReached")}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {t("dashboard.communitiesDesc", {
                          count: donorData.impact.communitiesReached,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      {t("dashboard.thankYou")}
                    </h4>
                    <p className="text-gray-600 mb-6">
                      {t("dashboard.rippleEffect")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                        {t("dashboard.makeAnotherDonation")}
                      </button>
                      <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium">
                        {t("dashboard.shareImpact")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showReceipt && selectedDonation && (
        <Receipt
          donation={selectedDonation}
          impact={impact}
          onClose={() => {
            setShowReceipt(false);
            setSelectedDonation(null);
          }}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
