import { useState, useEffect } from 'react';
import { PlusCircle, Save, Trash2, Lock, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BugReport {
  id: string;
  pattern: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  contractType: string;
  findingDate: string;
  mitigation: string;
}

export default function AdminBugReports() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState<BugReport[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newReport, setNewReport] = useState<Partial<BugReport>>({
    severity: 'Medium',
    findingDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = localStorage.getItem('bugReportsLibrary');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }

    // Check admin status
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const handleLogin = () => {
    // In a real app, this should be a secure authentication system
    // This is just for demonstration
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      toast.success('Logged in as admin');
    } else {
      toast.error('Invalid password');
    }
    setPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    toast.success('Logged out');
  };

  const handleSaveReport = () => {
    if (!newReport.pattern || !newReport.title || !newReport.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const report: BugReport = {
      ...newReport as BugReport,
      id: crypto.randomUUID()
    };

    const updatedReports = [...reports, report];
    setReports(updatedReports);
    localStorage.setItem('bugReportsLibrary', JSON.stringify(updatedReports));
    setIsAddingNew(false);
    setNewReport({
      severity: 'Medium',
      findingDate: new Date().toISOString().split('T')[0]
    });
    toast.success('Bug report added to library');
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('bugReportsLibrary', JSON.stringify(updatedReports));
    toast.success('Bug report deleted');
  };

  if (!isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Admin Access Required</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Bug Reports Library</h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            disabled={isAddingNew}
          >
            <PlusCircle className="w-5 h-5" />
            Add New Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <Lock className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </div>

      {isAddingNew && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Bug Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern to Match*
              </label>
              <input
                type="text"
                value={newReport.pattern || ''}
                onChange={(e) => setNewReport({...newReport, pattern: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 'transfer('"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                value={newReport.title || ''}
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Bug title"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                value={newReport.description || ''}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Detailed description of the bug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={newReport.severity}
                onChange={(e) => setNewReport({...newReport, severity: e.target.value as BugReport['severity']})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Type
              </label>
              <input
                type="text"
                value={newReport.contractType || ''}
                onChange={(e) => setNewReport({...newReport, contractType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ERC20, DEX, etc."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mitigation
              </label>
              <textarea
                value={newReport.mitigation || ''}
                onChange={(e) => setNewReport({...newReport, mitigation: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="How to fix this vulnerability"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              Save Report
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-1 ${
                  report.severity === 'Critical' ? 'text-red-600' :
                  report.severity === 'High' ? 'text-orange-600' :
                  report.severity === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Pattern: {report.pattern}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {report.contractType}
                    </span>
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  {report.mitigation && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Mitigation:</strong> {report.mitigation}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteReport(report.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
