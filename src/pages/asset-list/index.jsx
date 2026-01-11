import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import AssetDetailPanel from './components/AssetDetailPanel';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { formatAssetStatus } from '../../utils/formatters';
import { useSelector } from 'react-redux'; // Import useSelector
import { logActivity } from '../../utils/activityLogger'; // Import logActivity
import FilterToolbar from './components/FilterToolbar'; // Import FilterToolbar
import AssetTable from './components/AssetTable'; // Import AssetTable

// --- QR Code Modal Component ---
const QRCodeModal = ({ asset, onClose }) => {
    if (!asset) return null;
    const qrValue = JSON.stringify({ id: asset.id, tag: asset.asset_tag, serial: asset.serial_number });
    const handlePrint = () => window.print();

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center print:bg-white">
            <style>{`
                @media print {
                    body > *:not(.printable-area) { display: none !important; }
                    .printable-area { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
                    .no-print { display: none !important; }
                }
            `}</style>
            <div className="bg-card rounded-lg shadow-xl max-w-sm w-full relative printable-area">
                <div id="qr-code-content" className="p-8 text-center">
                    <h3 className="text-lg font-bold text-foreground mb-2">{asset.product_name}</h3>
                    <div className="bg-white p-4 rounded-md inline-block">
                        <QRCode value={qrValue} size={256} />
                    </div>
                    <div className="mt-4 text-left space-y-2">
                        <p><strong className="text-muted-foreground">Asset Tag:</strong> {asset.asset_tag}</p>
                        <p><strong className="text-muted-foreground">Serial No:</strong> {asset.serial_number}</p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-muted/50 flex justify-end gap-3 no-print">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handlePrint} iconName="Printer">Print</Button>
                </div>
            </div>
        </div>
    );
};

const AssetList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [qrAsset, setQrAsset] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [notifications, setNotifications] = useState([]);

    const { user: authUser } = useSelector((state) => state.auth); // Get user from Redux store
    const userId = authUser?.id;

    // Filter States
    const [filters, setFilters] = useState({
        searchQuery: '',
        category: '',
        status: [],
        department: '',
        supplier: '',
        location: '',
        dateRange: { start: '', end: '' }
    });

    // Data for filters
    const [departments, setDepartments] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const addNotification = (message, type) => {
        setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
    };

    const handleAssetClick = (asset) => setSelectedAsset(asset);
    const closePanel = () => setSelectedAsset(null);
    const handleOpenQrModal = (asset) => setQrAsset(asset);
    const handleCloseQrModal = () => setQrAsset(null);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    // Helper to fetch filter options
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const { data: departmentsData, error: departmentsError } = await supabase.from('departments').select('id, name');
                if (departmentsError) throw departmentsError;
                setDepartments(departmentsData.map(dep => ({ value: dep.id, label: dep.name })));

                const { data: suppliersData, error: suppliersError } = await supabase.from('suppliers').select('id, company_name');
                if (suppliersError) throw suppliersError;
                setSuppliers(suppliersData.map(sup => ({ value: sup.id, label: sup.company_name })));
            } catch (error) {
                addNotification(`Error fetching filter options: ${error.message}`, 'error');
            }
        };
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            addNotification(location.state.message, 'success');
            window.history.replaceState({}, '');
        }

        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                let query = supabase
                    .from('assets')
                    .select(`*, departments ( name ), suppliers ( company_name )`); // Ensure suppliers is selected

                // Apply filters
                if (filters.searchQuery) {
                    query = query.or(`product_name.ilike.%${filters.searchQuery}%,asset_tag.ilike.%${filters.searchQuery}%,serial_number.ilike.%${filters.searchQuery}%`);
                }
                if (filters.category) {
                    query = query.ilike('category', `%${filters.category}%`);
                }
                if (filters.status && filters.status.length > 0) {
                    query = query.in('status', filters.status);
                }
                if (filters.department) {
                    query = query.eq('current_department_id', filters.department);
                }
                if (filters.supplier) {
                    query = query.eq('supplier_id', filters.supplier);
                }
                if (filters.location) {
                    query = query.eq('location', filters.location);
                }
                if (filters.dateRange.start) {
                    query = query.gte('purchase_date', filters.dateRange.start);
                }
                if (filters.dateRange.end) {
                    query = query.lte('purchase_date', filters.dateRange.end);
                }

                // Handle sorting for nested properties
                const isNestedSort = sortConfig.key.includes('.');
                if (isNestedSort) {
                    const [foreignTable, column] = sortConfig.key.split('.');
                    query = query.order(column, { foreignTable, ascending: sortConfig.direction === 'asc' });
                } else {
                    query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
                }

                const { data: assetsData, error: assetsError } = await query;

                if (assetsError) throw assetsError;
                
                setAssets(assetsData);

            } catch (error) {
                addNotification(`Error fetching assets: ${error.message}`, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets();
    }, [sortConfig, location.state, filters]);
    
    const handleDeleteAsset = async (asset) => {
        if (window.confirm(`Are you sure you want to delete ${asset.product_name} (${asset.asset_tag})? This action cannot be undone.`)) {
            try {
                // Log activity before deletion
                await logActivity(
                  'asset_deleted',
                  `Deleted asset: ${asset.product_name} (${asset.asset_tag})`,
                  asset.id,
                  userId,
                  { deleted_asset_name: asset.product_name, deleted_asset_tag: asset.asset_tag }
                );

                const { error } = await supabase.from('assets').delete().eq('id', asset.id);
                if (error) throw error;
                setAssets(currentAssets => currentAssets.filter(a => a.id !== asset.id));
                addNotification('Asset deleted successfully.', 'success');
                
                if (selectedAsset && selectedAsset.id === asset.id) {
                    setSelectedAsset(null);
                }
            } catch (error) {
                addNotification(`Error deleting asset: ${error.message}`, 'error');
            }
        }
    };

    const handleAssetUpdate = (updatedAsset) => {
        setAssets(currentAssets =>
            currentAssets.map(a => (a.id === updatedAsset.id ? { ...a, ...updatedAsset } : a))
        );
        setSelectedAsset(prev => ({ ...prev, ...updatedAsset }));
    };


    return (
        <div className="p-6">
            <NotificationContainer notifications={notifications} onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
            <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Asset List</h1>
                        <p className="text-muted-foreground">Real-time inventory from database.</p>
                    </div>
                    <Button iconName="Plus" onClick={() => navigate('/asset-registration')}>Add New Asset</Button>
                </div>

                <FilterToolbar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={assets.length}
                    departments={departments}
                    suppliers={suppliers}
                    onExport={() => addNotification('Export functionality not yet implemented.', 'info')} // Placeholder
                />

                <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="p-6"><DashboardSkeleton /></div>
                    ) : assets.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Icon name="Package" size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No assets found.</p>
                            <p className="text-xs mt-2">Try adjusting your search or add a new asset.</p>
                        </div>
                    ) : (
                        <AssetTable
                            assets={assets}
                            sortConfig={sortConfig}
                            onSort={handleSort}
                            onAssetClick={handleAssetClick}
                            onOpenQrModal={handleOpenQrModal}
                            onDeleteAsset={handleDeleteAsset}
                        />
                    )}
                </div>
                
                <div className="text-xs text-muted-foreground text-center mt-4">
                    Showing {assets.length} total assets
                </div>
            </div>
            
            {selectedAsset && <AssetDetailPanel asset={selectedAsset} onClose={closePanel} onEdit={() => { navigate(`/asset-registration?id=${selectedAsset.id}`); closePanel(); }} onAssetUpdate={handleAssetUpdate} />}
            {qrAsset && <QRCodeModal asset={qrAsset} onClose={handleCloseQrModal} />}
        </div>
    );
};

export default AssetList;