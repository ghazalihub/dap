import * as geofire from 'geofire-common';

export const AppHelper = {
  calculateAge: (birthYear: number): number => {
    return new Date().getFullYear() - birthYear;
  },

  formatDistance: (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const dist = geofire.distanceBetween([lat1, lng1], [lat2, lng2]);
    if (dist < 1) {
      return `${Math.round(dist * 1000)} m away`;
    }
    return `${dist.toFixed(1)} km away`;
  },

  truncateText: (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  getTimeAgo: (timestamp: any): string => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date().getTime() - timestamp.seconds * 1000) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }
};
