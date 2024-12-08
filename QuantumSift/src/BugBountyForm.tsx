import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { BugBounty } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface BugBountyFormProps {
  onSubmit: (bounty: BugBounty) => void;
}

export default function BugBountyForm({ onSubmit }: BugBountyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BugBounty>>({
    title: '',
    description: '',
    platform: '',
    severity: 'Medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBounty: BugBounty = {
        ...formData,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      } as BugBounty;
      
      onSubmit(newBounty);
      setFormData({
        title: '',
        description: '',
        platform: '',
        severity: 'Medium',
      });
      setIsOpen(false);
      toast.success('Bug bounty added successfully!');
    } catch (error) {
      toast.error('Failed to add bug bounty');
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            Add Bug Bounty
          </motion.button>
        ) : (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value as BugBounty['severity']})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex gap-2">
              <motion.button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={20} />
                Save
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X size={20} />
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
