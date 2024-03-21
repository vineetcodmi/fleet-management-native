export const serialize = (params: any | undefined) => {
    if (params) {
      return (
        "?" +
        Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
      );
    } else {
      return "";
    }
};

export const extractCoordinates = (locationString: string) => {
  const pattern = /LL\(([\d]+:[\d]+:[\d]+\.\d+),([\d]+:[\d]+:[\d]+\.\d+)\)/;
  const match = locationString?.match(pattern);
  if (match) {
      const [lngString, latString] = match.slice(1);
      const latParts = latString.split(':').map(parseFloat);
      const lngParts = lngString.split(':').map(parseFloat);
      const latitude = (
        latParts[0] +
        latParts[1] / 60 +
        latParts[2] / 3600
      ).toFixed(4);
      const longitude = (
        lngParts[0] +
        lngParts[1] / 60 +
        lngParts[2] / 3600
      ).toFixed(4);
      return [parseFloat(latitude), parseFloat(longitude)];
  } else {
      return null;
  }
}

export const clusterEventCoordinate = async(events:any) => {
  if(events){
    const pattern = /LL\(([-\d.:]+),([-\d.:]+)\)/;
    let clusteredEvent:any = {};
    await events?.map((event:any) => {
      const locationString = event?.location;
      const match = locationString.match(pattern);
      if (match) {
        const latitude = parseFloat(match[2]);
        const longitude = parseFloat(match[1]);
        // Initialize the array if it doesn't exist yet
        clusteredEvent[`${latitude}-${longitude}`] = clusteredEvent[`${latitude}-${longitude}`] || [];
        clusteredEvent[`${latitude}-${longitude}`].push(event);
      } else {
        // Handle events with no location
        return;
      }
    })
    return clusteredEvent;
  } else {
    return null
  }
};

const calcDistance = (lat1: number, lon1: number, lat2:number, lon2:number) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};