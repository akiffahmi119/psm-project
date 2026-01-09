export const formatAssetStatus = (status) => {
  if (!status) return 'N/A';
  switch (status.toLowerCase()) {
    case 'in_storage':
      return 'In Storage';
    case 'checked_out':
      return 'Asset In Use';
    case 'in_repair':
      return 'In Repair';
    case 'retired':
      return 'Retired';
    case 'broken':
      return 'Broken';
    case 'lost':
      return 'Lost/Stolen';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }
};
