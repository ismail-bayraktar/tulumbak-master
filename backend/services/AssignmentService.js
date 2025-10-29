import branchModel from "../models/BranchModel.js";

// Haversine distance in kilometers
const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Determine best branch for an order
 * Priority: assignedZones by delivery.zoneId -> nearest by coordinates if available -> first active branch
 */
export async function findBestBranch({ delivery, address }) {
    // Fetch active branches
    const branches = await branchModel.find({ status: 'active' });
    if (!branches.length) return null;

    // 1) Zone-based match
    if (delivery?.zoneId) {
        const zoneBranches = branches.filter(b => Array.isArray(b.assignedZones) && b.assignedZones.includes(delivery.zoneId));
        if (zoneBranches.length === 1) return zoneBranches[0];
        if (zoneBranches.length > 1) {
            // If multiple, try nearest by coordinates if available
            const best = pickNearestByCoordinates(zoneBranches, address);
            if (best) return best;
            return zoneBranches[0];
        }
    }

    // 2) Nearest by coordinates if customer address has coords and branches have coords
    const nearest = pickNearestByCoordinates(branches, address);
    if (nearest) return nearest;

    // 3) Fallback: first active branch
    return branches[0];
}

function pickNearestByCoordinates(branches, address) {
    const addrLat = address?.coordinates?.latitude ?? address?.lat;
    const addrLon = address?.coordinates?.longitude ?? address?.lng;
    if (typeof addrLat !== 'number' || typeof addrLon !== 'number') return null;

    let best = null;
    let bestKm = Number.POSITIVE_INFINITY;

    for (const br of branches) {
        const brLat = br?.address?.coordinates?.latitude;
        const brLon = br?.address?.coordinates?.longitude;
        if (typeof brLat !== 'number' || typeof brLon !== 'number') continue;
        const km = haversineKm(addrLat, addrLon, brLat, brLon);
        if (km < bestKm) {
            bestKm = km;
            best = br;
        }
    }
    return best;
}

export default { findBestBranch };


