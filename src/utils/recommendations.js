// Smart recommendation engine for charging stations
export const getSmartRecommendations = (userLocation, stations, userHistory = []) => {
  // Calculate scores for each station based on multiple factors
  const scoredStations = stations.map(station => {
    let score = 0;

    // Distance factor (closer is better, max 40 points)
    const distanceScore = Math.max(0, 40 - (station.distance * 2));
    score += distanceScore;

    // Availability factor (max 25 points)
    if (station.availability === 'Available') {
      score += 25;
    } else if (station.availability === 'Limited') {
      score += 10;
    }

    // Rating factor (max 20 points)
    score += (station.rating / 5) * 20;

    // Price factor (cheaper is better, max 15 points) - only for EV stations
    if (typeof station.pricing === 'number') {
      const avgPrice = 0.35; // average price per kWh
      const priceScore = Math.max(0, 15 - ((station.pricing - avgPrice) * 50));
      score += priceScore;
    }

    // User history factor (previously visited, +20 points)
    const visitCount = userHistory.filter(h => h.stationId === station.id).length;
    if (visitCount > 0) {
      score += Math.min(20, visitCount * 5);
    }

    // Amenities bonus (+10 points if has amenities)
    if (station.amenities && station.amenities.length > 0) {
      score += 10;
    }

    // Fast charging bonus (+10 points if power > 50kW)
    if (station.power && station.power > 50) {
      score += 10;
    }

    return {
      ...station,
      recommendationScore: Math.round(score),
      reasons: generateReasons(station, distanceScore, visitCount)
    };
  });

  // Sort by score (highest first) and return top recommendations
  // Only include charging stations, not fuel stations
  return scoredStations
    .filter(s => s.type === 'charging')
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5);
};

// Generate human-readable reasons for recommendation
const generateReasons = (station, distanceScore, visitCount) => {
  const reasons = [];

  if (distanceScore >= 30) {
    reasons.push('Very close to you');
  } else if (distanceScore >= 20) {
    reasons.push('Nearby location');
  }

  if (station.availability === 'Available') {
    reasons.push('Currently available');
  }

  if (station.rating >= 4.5) {
    reasons.push('Highly rated');
  }

  if (typeof station.pricing === 'number' && station.pricing < 0.30) {
    reasons.push('Great price');
  }

  if (visitCount > 0) {
    reasons.push('You\'ve visited before');
  }

  if (station.power && station.power > 100) {
    reasons.push('Ultra-fast charging');
  } else if (station.power && station.power > 50) {
    reasons.push('Fast charging');
  }

  return reasons;
};

// Get personalized recommendations based on time of day
export const getTimeBasedRecommendations = (currentHour, stations) => {
  // Morning (6-9): Recommend stations near common commute routes
  // Afternoon (12-14): Recommend stations with food nearby
  // Evening (17-20): Recommend stations on way home
  // Night (20-6): Recommend 24/7 stations

  if (currentHour >= 20 || currentHour < 6) {
    // Night time - prioritize 24/7 stations
    return stations.filter(s => s.hours === '24/7');
  } else if (currentHour >= 12 && currentHour < 14) {
    // Lunch time - prioritize stations with amenities
    return stations.filter(s => s.amenities && s.amenities.length > 0);
  }

  // Default recommendations
  return stations;
};

// Calculate optimal charging time based on current battery and destination
export const getOptimalChargingTime = (currentBattery, destinationDistance, batteryCapacity, chargingPower) => {
  // Calculate energy needed
  const energyPerKm = 0.2; // kWh per km (typical for EVs)
  const energyNeeded = destinationDistance * energyPerKm;

  // Calculate current energy available
  const currentEnergy = (currentBattery / 100) * batteryCapacity;

  // Calculate energy to charge
  const energyToCharge = Math.max(0, energyNeeded - currentEnergy + (batteryCapacity * 0.2)); // +20% buffer

  // Calculate charging time in minutes
  const chargingTimeHours = energyToCharge / chargingPower;
  const chargingTimeMinutes = Math.ceil(chargingTimeHours * 60);

  return {
    energyNeeded,
    energyToCharge,
    chargingTime: chargingTimeMinutes,
    recommendedDuration: chargingTimeMinutes,
    finalBatteryPercent: Math.min(100, currentBattery + ((energyToCharge / batteryCapacity) * 100))
  };
};
