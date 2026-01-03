import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import AssetDetailPanel from './components/AssetDetailPanel';
import { NotificationContainer } from '../../components/ui/NotificationToast';

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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [qrAsset, setQrAsset] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [notifications, setNotifications] = useState([]);

    const user = { name: "Admin", role: "system_admin", email: "admin@pmma.com" };

    const addNotification = (message, type) => {
        setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
    };

    useEffect(() => {
        if (location.state?.message) {
            addNotification(location.state.message, 'success');
            window.history.replaceState({}, '');
        }

        const fetchAssetsAndSuppliers = async () => {
            setIsLoading(true);
            try {
                const [
                    { data: assetsData, error: assetsError },
                    { data: suppliersData, error: suppliersError }
                ] = await Promise.all([
                    supabase.from('assets').select(`*, departments ( name )`).order(sortConfig.key, { ascending: sortConfig.direction === 'asc' }),
                    supabase.from('suppliers').select('*')
                ]);

                if (assetsError) throw assetsError;
                if (suppliersError) throw suppliersError;

                const suppliersMap = suppliersData.reduce((acc, supplier) => {
                    acc[supplier.id] = supplier;
                    return acc;
                }, {});

                const joinedAssets = assetsData.map(asset => ({
                    ...asset,
                    suppliers: suppliersMap[asset.supplier_id]
                }));
                
                setAssets(joinedAssets);

            } catch (error) {
                addNotification(`Error fetching data: ${error.message}`, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssetsAndSuppliers();
    }, [sortConfig, location.state]);
    
    const handleDeleteAsset = async (asset) => {
        if (window.confirm(`Are you sure you want to delete ${asset.product_name} (${asset.asset_tag})? This action cannot be undone.`)) {
            try {
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

    const sortedAndFilteredAssets = useMemo(() => {
        return assets.filter(asset => {
            const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = (asset.product_name || '').toLowerCase().includes(searchLower) ||
                                (asset.asset_tag || '').toLowerCase().includes(searchLower) ||
                                (asset.serial_number || '').toLowerCase().includes(searchLower);
            return matchesCategory && matchesSearch;
        });
    }, [assets, filterCategory, searchQuery]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return 'ArrowUpDown';
        return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
    };

    const handleAssetClick = (asset) => setSelectedAsset(asset);
    const closePanel = () => setSelectedAsset(null);
    const handleOpenQrModal = (asset) => setQrAsset(asset);
    const handleCloseQrModal = () => setQrAsset(null);

    const getStatusColor = (status) => {
        switch(status) {
            case 'In Use': return 'bg-green-100 text-green-800 border-green-200';
            case 'In Storage': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Retired': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };
    
    const allCategories = ["Laptop", "Desktop", "Monitor", "Printer", "Server", "Network", "Mobile", "Tablet", "Software", "Other"];

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} user={user} />
            <NotificationContainer notifications={notifications} onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
            
            <div className={`main-content transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
                <Header user={user} />
                
                <main className="pt-16 p-6">
                    <div className="space-y-6">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Asset List</h1>
                                <p className="text-muted-foreground">Real-time inventory from database.</p>
                            </div>
                            <Button iconName="Plus" onClick={() => navigate('/asset-registration')}>Add New Asset</Button>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Search by Tag, Name, or Serial..." 
                                    className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select 
                                className="px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                            {isLoading ? (
                                <div className="p-6"><DashboardSkeleton /></div>
                            ) : sortedAndFilteredAssets.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <Icon name="Package" size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No assets found.</p>
                                    <p className="text-xs mt-2">Try adjusting your search or add a new asset.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Asset Tag</th>
                                                <th className="px-6 py-4 font-medium">Product Details</th>
                                                <th className="px-6 py-4 font-medium"><button onClick={() => handleSort('category')} className="flex items-center gap-2">Category<Icon name={getSortIcon('category')} size={14} /></button></th>
                                                <th className="px-6 py-4 font-medium">Department</th>
                                                <th className="px-6 py-4 font-medium">Supplier</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                                <th className="px-6 py-4 font-medium text-right">Price</th>
                                                <th className="px-6 py-4 font-medium text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {sortedAndFilteredAssets.map((asset) => (
                                                <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-4"><button onClick={() => handleAssetClick(asset)} className="font-medium text-primary hover:underline">{asset.asset_tag}</button></td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-foreground">{asset.product_name}</div>
                                                        <div className="text-xs text-muted-foreground">{asset.serial_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4">{asset.category}</td>
                                                    <td className="px-6 py-4">{asset.departments?.name || 'Unknown'}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{asset.suppliers?.company_name || 'Unknown'}</td>
                                                    <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>{asset.status}</span></td>
                                                    <td className="px-6 py-4 text-right font-medium">{asset.purchase_price ? `RM ${asset.purchase_price.toLocaleString()}` : '-'}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Button variant="ghost" size="icon" onClick={() => navigate(`/asset-registration?id=${asset.id}`)} className="h-8 w-8 text-muted-foreground hover:text-primary"><Icon name="Pencil" size={16} /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleOpenQrModal(asset)} className="h-8 w-8 text-muted-foreground hover:text-primary"><Icon name="QrCode" size={16} /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Icon name="Trash" size={16} /></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground text-center mt-4">
                            Showing {sortedAndFilteredAssets.length} total assets
                        </div>
                    </div>
                </main>
            </div>
            
            {selectedAsset && <AssetDetailPanel asset={selectedAsset} onClose={closePanel} onEdit={() => { navigate(`/asset-registration?id=${selectedAsset.id}`); closePanel(); }} onAssetUpdate={handleAssetUpdate} />}
            {qrAsset && <QRCodeModal asset={qrAsset} onClose={handleCloseQrModal} />}
        </div>
    );
};

export default AssetList;