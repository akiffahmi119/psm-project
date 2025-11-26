import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

import Icon from '../../../components/AppIcon';

const ScenarioPlanning = ({ onScenarioChange }) => {
  const [activeScenario, setActiveScenario] = useState('current');
  const [customBudget, setCustomBudget] = useState('700000');
  const [delayMonths, setDelayMonths] = useState('0');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const scenarios = [
    {
      id: 'current',
      name: 'Current Plan',
      description: 'Follow standard lifecycle replacement schedule',
      totalCost: 700000,
      timeframe: '6 months',
      riskLevel: 'Low'
    },
    {
      id: 'accelerated',
      name: 'Accelerated Replacement',
      description: 'Replace all critical assets within 3 months',
      totalCost: 850000,
      timeframe: '3 months',
      riskLevel: 'Low'
    },
    {
      id: 'delayed',
      name: 'Budget Constrained',
      description: 'Delay non-critical replacements by 6 months',
      totalCost: 450000,
      timeframe: '12 months',
      riskLevel: 'Medium'
    },
    {
      id: 'custom',
      name: 'Custom Scenario',
      description: 'Define your own replacement parameters',
      totalCost: parseInt(customBudget) || 0,
      timeframe: 'Variable',
      riskLevel: 'Variable'
    }
  ];

  const budgetOptions = [
    { value: '400000', label: '$400,000' },
    { value: '500000', label: '$500,000' },
    { value: '600000', label: '$600,000' },
    { value: '700000', label: '$700,000' },
    { value: '800000', label: '$800,000' },
    { value: '900000', label: '$900,000' },
    { value: '1000000', label: '$1,000,000' }
  ];

  const delayOptions = [
    { value: '0', label: 'No Delay' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '9', label: '9 Months' },
    { value: '12', label: '12 Months' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Assets' },
    { value: 'critical', label: 'Critical Only' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium & Above' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'High': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const handleScenarioSelect = (scenarioId) => {
    setActiveScenario(scenarioId);
    const scenario = scenarios?.find(s => s?.id === scenarioId);
    if (onScenarioChange) {
      onScenarioChange(scenario);
    }
  };

  const handleApplyCustom = () => {
    const customScenario = {
      ...scenarios?.find(s => s?.id === 'custom'),
      totalCost: parseInt(customBudget) || 0,
      delayMonths: parseInt(delayMonths) || 0,
      priorityFilter
    };
    
    if (onScenarioChange) {
      onScenarioChange(customScenario);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Scenario Planning</h3>
          <p className="text-sm text-muted-foreground">
            Compare different replacement strategies and their budget impact
          </p>
        </div>
        <Icon name="Calculator" size={20} className="text-primary" />
      </div>
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {scenarios?.map((scenario) => (
          <div
            key={scenario?.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              activeScenario === scenario?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => handleScenarioSelect(scenario?.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{scenario?.name}</h4>
              <div className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(scenario?.riskLevel)}`}>
                {scenario?.riskLevel}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{scenario?.description}</p>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className="font-medium text-foreground">{formatCurrency(scenario?.totalCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timeframe:</span>
                <span className="font-medium text-foreground">{scenario?.timeframe}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Custom Scenario Controls */}
      {activeScenario === 'custom' && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-4">Custom Scenario Parameters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Budget Limit"
              options={budgetOptions}
              value={customBudget}
              onChange={setCustomBudget}
            />
            
            <Select
              label="Delay Period"
              options={delayOptions}
              value={delayMonths}
              onChange={setDelayMonths}
            />
            
            <Select
              label="Priority Filter"
              options={priorityOptions}
              value={priorityFilter}
              onChange={setPriorityFilter}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="default"
              iconName="Play"
              onClick={handleApplyCustom}
            >
              Apply Scenario
            </Button>
          </div>
        </div>
      )}
      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Budget Impact</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatCurrency(scenarios?.find(s => s?.id === activeScenario)?.totalCost || 0)}
          </div>
          <div className="text-xs text-muted-foreground">
            {activeScenario === 'current' ? 'Baseline budget' : 
             activeScenario === 'accelerated' ? '+21% vs baseline' :
             activeScenario === 'delayed' ? '-36% vs baseline' : 'Custom budget'}
          </div>
        </div>

        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Timeline</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {scenarios?.find(s => s?.id === activeScenario)?.timeframe || 'Variable'}
          </div>
          <div className="text-xs text-muted-foreground">
            Completion timeframe
          </div>
        </div>

        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Risk Level</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {scenarios?.find(s => s?.id === activeScenario)?.riskLevel || 'Variable'}
          </div>
          <div className="text-xs text-muted-foreground">
            Operational risk
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanning;