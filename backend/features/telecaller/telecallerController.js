import Telecaller from './telecallerModel.js';
import User from '../users/userModel.js'; // Assuming userModel is here, need to verify import path
import { asyncHandler } from '../../middleware/asyncHandler.js';
import ExcelJS from 'exceljs';

// @desc    Create a new telecaller
// @route   POST /api/telecallers
// @access  Private/Admin
export const createTelecaller = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error('Name and phone are required');
  }

  // Generate Referral ID (AE00, AE01...)
  // Find the last created telecaller to increment ID
  let newId = 'AE00';
  const lastTelecaller = await Telecaller.findOne().sort({ createdAt: -1 });

  if (lastTelecaller && lastTelecaller.referralId) {
    const lastIdNum = parseInt(lastTelecaller.referralId.replace('AE', ''), 10);
    if (!isNaN(lastIdNum)) {
        const nextNum = lastIdNum + 1;
        newId = `AE${nextNum.toString().padStart(2, '0')}`;
    }
  }

  const telecaller = await Telecaller.create({
    name,
    phone,
    email,
    referralId: newId,
  });

  res.status(201).json({
    success: true,
    data: telecaller,
  });
});

// @desc    Get all telecallers (including inactive) with onboarding counts
// @route   GET /api/telecallers
// @access  Private/Admin
export const getAllTelecallers = asyncHandler(async (req, res) => {
  const telecallers = await Telecaller.find().sort({ createdAt: -1 });
  
  res.json({
    success: true,
    data: telecallers,
  });
});

// @desc    Toggle active status (Soft delete/Deactivate)
// @route   PUT /api/telecallers/:id/status
// @access  Private/Admin
export const updateTelecallerStatus = asyncHandler(async (req, res) => {
  const telecaller = await Telecaller.findById(req.params.id);

  if (!telecaller) {
    res.status(404);
    throw new Error('Telecaller not found');
  }

  telecaller.active = !telecaller.active;
  await telecaller.save();

  res.json({
    success: true,
    message: `Telecaller set to ${telecaller.active ? 'active' : 'inactive'}`,
    data: telecaller,
  });
});

// @desc    Get detailed stats for telecallers
// @route   GET /api/telecallers/stats
// @access  Private/Admin
export const getTelecallerStats = asyncHandler(async (req, res) => {
    // This could also include filters like day/month logic if needed on API side, 
    // or return everything populated for frontend filtering.
    // For now, let's return populated onboardings so Admin can filter by date.
    
    const telecallers = await Telecaller.find().populate('onboardings', 'name email phone createdAt role');

    res.json({
        success: true,
        data: telecallers
    });
});

// @desc    Download Excel Report
// @route   GET /api/telecallers/export
// @access  Private/Admin

// @desc    Update telecaller profile
// @route   PUT /api/telecallers/:id
// @access  Private/Admin
export const updateTelecaller = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;
  
  const telecaller = await Telecaller.findById(req.params.id);

  if (!telecaller) {
    res.status(404);
    throw new Error('Telecaller not found');
  }

  telecaller.name = name || telecaller.name;
  telecaller.phone = phone || telecaller.phone;
  telecaller.email = email || telecaller.email;

  const updatedTelecaller = await telecaller.save();

  res.json({
    success: true,
    data: updatedTelecaller,
  });
});

// @desc    Download Excel Report
// @route   GET /api/telecallers/export
// @access  Private/Admin
export const downloadReport = asyncHandler(async (req, res) => {
  const { filterType, date, promoCode } = req.query;

  // Build filter for onboardings (users/vendors)
  let dateFilter = {};
  
  if (filterType === 'daily' && date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    dateFilter = { createdAt: { $gte: start, $lte: end } };
  } else if (filterType === 'monthly' && date) {
    const [year, month] = date.split('-');
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    dateFilter = { createdAt: { $gte: start, $lte: end } };
  }

  // Build root filter for Telecallers (e.g. by promo code)
  let telecallerFilter = {};
  if (promoCode) {
      telecallerFilter.referralId = { $regex: promoCode, $options: 'i' }; // Case insensitive partial match or exact match
  }

  // Find telecallers and populate onboardings with the date filter
  // Note: We need to filter the populated array. Mongoose 'match' option in populate is perfect for this.
  const telecallers = await Telecaller.find(telecallerFilter).populate({
      path: 'onboardings',
      match: Object.keys(dateFilter).length > 0 ? dateFilter : {}, 
      select: 'name email phone createdAt'
  });

  const workbook = new ExcelJS.Workbook();
  
  // Sheet 1: Vendor Onboardings (Filtered)
  const sheet1 = workbook.addWorksheet('Vendor Onboardings');
  sheet1.columns = [
    { header: 'Promo Code', key: 'refId', width: 15 },
    { header: 'Vendor Name', key: 'vName', width: 25 },
    { header: 'Vendor Phone', key: 'vPhone', width: 15 },
    { header: 'Vendor Email', key: 'vEmail', width: 25 },
    { header: 'Onboarding Date', key: 'date', width: 15 },
    { header: 'Onboarding Time', key: 'time', width: 15 },
    { header: 'Telecaller Name', key: 'tcName', width: 20 },
  ];

  telecallers.forEach(tc => {
      // onboardings is already filtered by the populate match
      if (tc.onboardings && tc.onboardings.length > 0) {
          tc.onboardings.forEach(vendor => {
              const d = new Date(vendor.createdAt);
              sheet1.addRow({
                  refId: tc.referralId,
                  vName: vendor.name,
                  vPhone: vendor.phone,
                  vEmail: vendor.email,
                  date: d.toLocaleDateString(),
                  time: d.toLocaleTimeString(),
                  tcName: tc.name
              });
          });
      }
  });

  // Sheet 2: Telecaller Summary
  // For the summary, if we are filtering by date, 'Total Onboardings' should probably reflect the *filtered* count for clarity,
  // or maybe the user wants total stats? Usually reports are context-aware. I'll simplify: 
  // 'Onboardings (Selected Period)' and 'Total Onboardings (All Time)'.
  // However, fetching all time count while filtering requires a separate query or aggregation. 
  // To keep it simple and likely what's expected: show count for the filtered period.
  
  // Determine period label for the header
  let periodLabel = 'All Time';
  if (filterType === 'daily' && date) {
      const d = new Date(date);
      periodLabel = d.toLocaleDateString();
  } else if (filterType === 'monthly' && date) {
      const [year, month] = date.split('-');
      const d = new Date(year, month - 1);
      periodLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
  }

  const sheet2 = workbook.addWorksheet('Telecaller Summary');
  sheet2.columns = [
    { header: 'Promo Code', key: 'id', width: 15 },
    { header: `Onboardings (${periodLabel})`, key: 'periodTotal', width: 30 },
    { header: 'Telecaller Name', key: 'name', width: 20 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 20 },
    { header: 'Status', key: 'status', width: 10 },
  ];

  telecallers.forEach(tc => {
      sheet2.addRow({
          id: tc.referralId,
          periodTotal: tc.onboardings ? tc.onboardings.length : 0,
          name: tc.name,
          phone: tc.phone,
          email: tc.email || '-',
          status: tc.active ? 'Active' : 'Inactive'
      });
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + `telecaller_report_${filterType || 'all'}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
});

