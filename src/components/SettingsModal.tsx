import React, { useState, useContext } from 'react';
import { X, Save } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    companyName: 'PharmaCare',
    email: 'contact@pharmacare.com',
    phone: '(555) 123-4567',
    address: '123 Healthcare Ave, Medical City, MC 12345',
    currency: 'USD',
    lowStockThreshold: '100',
    enableNotifications: true,
    enableAutoBackup: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{t('systemSettings')}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('companyName')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('phone')}
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('currency')}
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SAR">SAR (﷼)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('language')}
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('lowStockThreshold')}
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: e.target.value })}
                dir="ltr"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('address')}
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="text-sm text-gray-700">
                  {t('enableNotifications')}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={settings.enableAutoBackup}
                  onChange={(e) => setSettings({ ...settings, enableAutoBackup: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoBackup" className="text-sm text-gray-700">
                  {t('enableAutoBackup')}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}