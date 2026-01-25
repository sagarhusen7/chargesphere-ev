import React, { useState } from 'react';
import { DollarSign, TrendingDown, Zap, Fuel, Home, Calendar, PieChart } from 'lucide-react';

const CostCalculator = () => {
  const [inputs, setInputs] = useState({
    // Vehicle specs
    batteryCapacity: 60, // kWh
    efficiency: 15, // kWh per 100km
    monthlyDistance: 1000, // km
    
    // Charging costs
    homeCost: 0.12, // $ per kWh
    publicCost: 0.35, // $ per kWh
    homeChargingPercent: 70, // %
    
    // Comparison
    gasolinePrice: 3.50, // $ per gallon
    gasolineMPG: 30 // miles per gallon
  });

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  // Calculate costs
  const monthlyEnergyNeeded = (inputs.monthlyDistance / 100) * inputs.efficiency; // kWh
  const homeChargingKWh = monthlyEnergyNeeded * (inputs.homeChargingPercent / 100);
  const publicChargingKWh = monthlyEnergyNeeded * ((100 - inputs.homeChargingPercent) / 100);
  
  const monthlyCostHome = homeChargingKWh * inputs.homeCost;
  const monthlyCostPublic = publicChargingKWh * inputs.publicCost;
  const monthlyCostEV = monthlyCostHome + monthlyCostPublic;
  const yearlyCostEV = monthlyCostEV * 12;
  
  // Gasoline comparison (convert km to miles)
  const monthlyMiles = inputs.monthlyDistance * 0.621371;
  const monthlyGallons = monthlyMiles / inputs.gasolineMPG;
  const monthlyCostGas = monthlyGallons * inputs.gasolinePrice;
  const yearlyCostGas = monthlyCostGas * 12;
  
  // Savings
  const monthlySavings = monthlyCostGas - monthlyCostEV;
  const yearlySavings = yearlyCostGas - yearlyCostEV;
  const fiveYearSavings = yearlySavings * 5;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-white">Cost Calculator</h2>
          <p className="text-white/60 dark:text-gray-400 text-sm">
            Compare EV charging vs gasoline costs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Vehicle & Usage */}
          <div>
            <h3 className="font-semibold text-white dark:text-white mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-electric-400" />
              Vehicle & Usage
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Battery Capacity: {inputs.batteryCapacity} kWh
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={inputs.batteryCapacity}
                  onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Efficiency: {inputs.efficiency} kWh/100km
                </label>
                <input
                  type="range"
                  min="12"
                  max="25"
                  step="1"
                  value={inputs.efficiency}
                  onChange={(e) => handleInputChange('efficiency', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Monthly Distance: {inputs.monthlyDistance} km
                </label>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={inputs.monthlyDistance}
                  onChange={(e) => handleInputChange('monthlyDistance', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Charging Costs */}
          <div>
            <h3 className="font-semibold text-white dark:text-white mb-3 flex items-center">
              <Home className="w-4 h-4 mr-2 text-primary-400" />
              Charging Costs
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Home Charging Rate: ${inputs.homeCost}/kWh
                </label>
                <input
                  type="number"
                  min="0.05"
                  max="0.50"
                  step="0.01"
                  value={inputs.homeCost}
                  onChange={(e) => handleInputChange('homeCost', e.target.value)}
                  className="input-field py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Public Charging Rate: ${inputs.publicCost}/kWh
                </label>
                <input
                  type="number"
                  min="0.20"
                  max="0.80"
                  step="0.05"
                  value={inputs.publicCost}
                  onChange={(e) => handleInputChange('publicCost', e.target.value)}
                  className="input-field py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Home Charging: {inputs.homeChargingPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={inputs.homeChargingPercent}
                  onChange={(e) => handleInputChange('homeChargingPercent', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Gasoline Comparison */}
          <div>
            <h3 className="font-semibold text-white dark:text-white mb-3 flex items-center">
              <Fuel className="w-4 h-4 mr-2 text-orange-400" />
              Gasoline Comparison
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  Gas Price: ${inputs.gasolinePrice}/gallon
                </label>
                <input
                  type="number"
                  min="2.00"
                  max="6.00"
                  step="0.10"
                  value={inputs.gasolinePrice}
                  onChange={(e) => handleInputChange('gasolinePrice', e.target.value)}
                  className="input-field py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/80 dark:text-gray-300 mb-1">
                  MPG: {inputs.gasolineMPG}
                </label>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={inputs.gasolineMPG}
                  onChange={(e) => handleInputChange('gasolineMPG', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* EV Cost */}
            <div className="bg-electric-500/10 border-2 border-electric-500/30 rounded-lg p-4">
              <Zap className="w-6 h-6 text-electric-400 mb-2" />
              <p className="text-sm text-electric-300 mb-1">EV Charging</p>
              <p className="text-2xl font-bold text-white dark:text-white">
                ${monthlyCostEV.toFixed(2)}
              </p>
              <p className="text-xs text-electric-300/60">per month</p>
            </div>

            {/* Gas Cost */}
            <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-lg p-4">
              <Fuel className="w-6 h-6 text-orange-400 mb-2" />
              <p className="text-sm text-orange-300 mb-1">Gasoline</p>
              <p className="text-2xl font-bold text-white dark:text-white">
                ${monthlyCostGas.toFixed(2)}
              </p>
              <p className="text-xs text-orange-300/60">per month</p>
            </div>
          </div>

          {/* Savings */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-lg p-6">
            <TrendingDown className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-sm text-green-300 mb-2">Monthly Savings</p>
            <p className="text-4xl font-bold text-green-400 mb-4">
              ${monthlySavings.toFixed(2)}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Yearly
                </span>
                <span className="text-white dark:text-white font-semibold">
                  ${yearlySavings.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 dark:text-gray-400">5 Years</span>
                <span className="text-green-400 font-bold">
                  ${fiveYearSavings.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white/5 dark:bg-gray-800/50 rounded-lg p-4 border border-white/10 dark:border-gray-700">
            <h4 className="font-semibold text-white dark:text-white mb-3 flex items-center">
              <PieChart className="w-4 h-4 mr-2" />
              Monthly Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60 dark:text-gray-400">Home Charging ({inputs.homeChargingPercent}%)</span>
                <span className="text-white dark:text-white">${monthlyCostHome.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 dark:text-gray-400">Public Charging ({100 - inputs.homeChargingPercent}%)</span>
                <span className="text-white dark:text-white">${monthlyCostPublic.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 dark:border-gray-700 pt-2 mt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white dark:text-white">Energy Needed</span>
                  <span className="text-electric-400">{monthlyEnergyNeeded.toFixed(1)} kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300 mb-2">🌍 Environmental Impact</p>
            <p className="text-white/80 dark:text-gray-300 text-sm">
              By using EV charging, you save approximately{' '}
              <span className="text-blue-400 font-semibold">
                {(monthlyGallons * 8.89).toFixed(1)} kg CO₂
              </span>{' '}
              per month compared to gasoline!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
