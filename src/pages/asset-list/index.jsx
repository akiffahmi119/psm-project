import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { DashboardSkeleton } from '../../components/ui/LoadingState';

const AssetList = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock User (Keep consistent for UI)
    const user = { name: "Admin", role: "system_admin", email: "admin@pmma.com" };

    // --- 1. FETCH REAL DATA (With Joins) ---
    // 
    // This fetches the Asset, plus the NAME of the Department and Supplier
    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('assets')
                    .select(`
                        *,
                        departments ( name ),
                        suppliers ( name )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setAssets(data);
            } catch (error) {
                console.error("Error fetching assets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, []);

    // --- 2. CLIENT-SIDE FILTERING ---
    const filteredAssets = assets.filter(asset => {
        const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
        
        // Safe search: checks Tag, Product Name, and Serial Number
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            (asset.product_name || '').toLowerCase().includes(searchLower) ||
            (asset.asset_tag || '').toLowerCase().includes(searchLower) ||
            (asset.serial_number || '').toLowerCase().includes(searchLower);
        
        return matchesCategory && matchesSearch;
    });

    // Helper: Badge Colors
    const getStatusColor = (status) => {
        switch(status) {
            case 'In Use': return 'bg-green-100 text-green-800 border-green-200';
            case 'In Storage': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Retired': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} user={user} />
            
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
                <Header user={user} />
                
                <main className="pt-16 p-6">
                    <div className="space-y-6">
                        
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Asset List</h1>
                                <p className="text-muted-foreground">Real-time inventory from database.</p>
                            </div>
                            <Button iconName="Plus" onClick={() => navigate('/asset-registration')}>
                                Add New Asset
                            </Button>
                        </div>

                        {/* Search & Filter Section */}
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
                                <option value="Laptop">Laptop</option>
                                <option value="Desktop">Desktop</option>
                                <option value="Monitor">Monitor</option>
                                <option value="Printer">Printer</option>
                                <option value="Network">Network</option>
                            </select>
                        </div>

                        {/* Data Table */}
                        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                            {isLoading ? (
                                <div className="p-6"><DashboardSkeleton /></div>
                            ) : filteredAssets.length === 0 ? (
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
                                                <th className="px-6 py-4 font-medium">Department</th>
                                                <th className="px-6 py-4 font-medium">Supplier</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                                <th className="px-6 py-4 font-medium text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredAssets.map((asset) => (
                                                <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-primary">
                                                        {asset.asset_tag}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-foreground">{asset.product_name}</div>
                                                        <div className="text-xs text-muted-foreground">{asset.serial_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {/* This displays the JOINED data from the relationships */}
                                                        {asset.departments?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {asset.suppliers?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                                                            {asset.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-medium">
                                                        {asset.purchase_price ? `RM ${asset.purchase_price.toLocaleString()}` : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground text-center mt-4">
                            Showing {filteredAssets.length} total assets
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AssetList;