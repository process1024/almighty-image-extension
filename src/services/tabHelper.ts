import {
  createTab,
  getActiveTab,
  updateTab,
} from '~shared/chrome/messages';

export const isBackgroundScript = () => {
  return typeof window === 'undefined';
};

export default { getActiveTab, isBackgroundScript, updateTab, createTab };
