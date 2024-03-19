// import React, {useEffect, useState} from 'react';
// import {Image, StyleSheet, View} from 'react-native';
// import MapboxGL from '@rnmapbox/maps';
// MapboxGL.setAccessToken(
//   'sk.eyJ1Ijoia2FuaXNoa2ExMiIsImEiOiJjbHRtb2gyOGUxZHVnMmtwNmNtYWk5NXBoIn0.a_0PY24VVZnS2PoE1sqbag',
// );

// const MapBox = ({eventMarker, unitMarker, activeTab,handleMarkerEventsClick,handleMarkerUnitClick}: any) => {

//   return (
//     <View style={styles.root}>
//       <View style={styles.container}>
//         <MapboxGL.MapView style={styles.map}>
//           <MapboxGL.Camera zoomLevel={3} centerCoordinate={[78, 30]} />
//           {eventMarker.map(
//             (item: any) =>
//               (activeTab === 'All' || activeTab === 'Events') && (
//                 <MapboxGL.MarkerView
//                   id={item.id}
//                   coordinate={item.coordinate}
//                   key={item.id}
//                   onSelect={() =>handleMarkerEventsClick(item.id)}
//                   >
//                   <Image
//                     source={require('../../assets/download.jpeg')}
//                     style={{height: 30, width: 30}}
//                   />

//                 </MapboxGL.MarkerView>
//               ),
//           )}
//           {unitMarker.map(
//             (item: any) =>
//               (activeTab === 'All' || activeTab === 'Units') && (
//                 <MapboxGL.MarkerView
//                   id={item.id}
//                   coordinate={item.coordinate}
//                   key={item.id}
//                   onPress={() => console.log("Marker clicked")
//                   }
//                   >
//                   <Image
//                     source={require('../../assets/background.png')}
//                     style={{height: 30, width: 30}}
//                   />
//                 </MapboxGL.MarkerView>
//               ),
//           )}
//         </MapboxGL.MapView>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default MapBox;

import React, {useEffect, useState, useRef} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import colors from '../../utlits/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { useAuth } from '../../context/Auth';

MapboxGL.setAccessToken(
  'sk.eyJ1Ijoia2FuaXNoa2ExMiIsImEiOiJjbHRtb2gyOGUxZHVnMmtwNmNtYWk5NXBoIn0.a_0PY24VVZnS2PoE1sqbag',
);

const MapBox = ({
  eventMarker,
  unitMarker,
  currentLocation,
  activeTab,
  handleMarkerEventsClick,
  handleMarkerUnitClick,
  isEventDetail
}: any) => {
  const { user } = useAuth();
  const mapRef = useRef<MapboxGL.MapView | null>(null);
  const [eventClusteredData, setEventClusteredData] = useState<any>([]);
  const [unitClusteredData, setUnitClusteredData] = useState<any>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const [region, setRegion] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);

  useEffect(() => {
    const newEventClusteredData = clusterMarkers(
      eventMarker,
      zoomLevel,
      region,
    );
    const newUnitClusteredData = clusterMarkers(unitMarker, zoomLevel, region);
    setEventClusteredData(newEventClusteredData);
    setUnitClusteredData(newUnitClusteredData);
  }, [eventMarker, unitMarker, zoomLevel, region]);

  const clusterMarkers = (
    markers: any[],
    zoomLevel: number,
    currentRegion: [number, number, number, number],
  ) => {
    const CLUSTER_RADIUS = calculateClusterRadius(zoomLevel); // Calculate cluster radius based on zoom level

    const clusteredMarkers: any[] = [];

    markers.forEach(marker => {
      const [lon, lat] = marker.coordinate;

      // Check if the marker is within the current visible region
      if (
        lon <= currentRegion[0] &&
        lon >= currentRegion[2] &&
        lat <= currentRegion[1] &&
        lat >= currentRegion[3]
      ) {
        // Find the existing cluster within the radius of this marker, if any
        const existingCluster = clusteredMarkers.find(cluster => {
          return (
            getDistance(marker.coordinate, cluster.coordinate) <=
              CLUSTER_RADIUS &&
            cluster.coordinate[0] <= currentRegion[0] &&
            cluster.coordinate[0] >= currentRegion[2] &&
            cluster.coordinate[1] <= currentRegion[1] &&
            cluster.coordinate[1] >= currentRegion[3]
          );
        });

        if (existingCluster) {
          // Add the marker's coordinate to the existing cluster
          existingCluster.markers.push({cordinate: marker.coordinate, id: marker?.id});
        } else {
          // Create a new cluster for this marker
          clusteredMarkers.push({
            coordinate: marker.coordinate,
            markers: [
              {coordinate: marker.coordinate, id: marker?.id}
            ],
          });
        }
      }
    });
    return clusteredMarkers;
  };

  // Calculate cluster radius based on zoom level
  const calculateClusterRadius = (zoomLevel: number) => {
    const baseRadius = 100;
    const radius = baseRadius / zoomLevel;
    return radius;
  };

  // Function to calculate distance between two coordinates
  const getDistance = (coord1: number[], coord2: number[]) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Function to convert degrees to radians
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Handle zoom level change
  const handleZoomChange = async () => {
    if (mapRef.current) {
      const currentZoom = await mapRef.current.getZoom();
      const currentRegion = await mapRef.current.getVisibleBounds();
      setRegion([
        currentRegion[0][0],
        currentRegion[0][1],
        currentRegion[1][0],
        currentRegion[1][1],
      ]);
      setZoomLevel(currentZoom);
    }
  };

  useEffect(() => {
    handleZoomChange();
  },[mapRef?.current])

  const createCurrentLocationIcon = () => {
    return (
      <Pressable style={styles.currentLocationWrapper} onPress={() => handleMarkerUnitClick(user?.unitId)}>
        {!isEventDetail ? <View style={styles.markerWrapper}>
          <View style={styles.clusterMarkerContent}>
            <View
              style={[
                styles.markerContentTitleBox,
                {backgroundColor: '#1b4332'},
              ]}>
              <Text style={[styles.clusterMarkerContentTitle, {fontSize: 11}]}>{user?.beat}</Text>
            </View>
            <Image source={require('../../assets/unitPopup.png')} />
          </View>
          <View style={styles.unitIconBox}>
            <Ionicons name="car-outline" size={17} color={colors.white} />
          </View>
        </View> : <Entypo name="dot-single" size={26} color={colors.black} />}
      </Pressable>
    );
  };

  const createEventIcon = (data: any, id: string) => {
    return (
      <Pressable style={styles.markerWrapper} onPress={() => handleMarkerEventsClick(id)}>
        <View style={styles.clusterMarkerContent}>
          <View style={styles.markerContentTitleBox}>
            <Text style={[styles.clusterMarkerContentTitle, {fontSize: 7.5}]}>
              {id}
            </Text>
          </View>
          <Image source={require('../../assets/unitPopup.png')} />
        </View>
        <View style={styles.eventIconBox}>
          <Image source={require('../../assets/ellipse.png')} />
        </View>
      </Pressable>
    );
  };

  const createUnitIcon = (data: any, id: string) => {
    return (
      <Pressable style={styles.markerWrapper} onPress={() => handleMarkerUnitClick(id)}>
        <View style={styles.clusterMarkerContent}>
          <View
            style={[
              styles.markerContentTitleBox,
              {backgroundColor: '#1b4332'},
            ]}>
            <Text style={[styles.clusterMarkerContentTitle, {fontSize: 12}]}>{id}</Text>
          </View>
          <Image source={require('../../assets/unitPopup.png')} />
        </View>
        <View style={styles.unitIconBox}>
          <Ionicons name="car-outline" size={17} color={colors.white} />
        </View>
      </Pressable>
    );
  };

  const createEventClusterIcon = (data: any) => {
    return (
      <View style={styles.markerWrapper}>
        <View style={styles.clusterMarkerContent}>
          <View style={styles.clusterMarkerContentTitleBox}>
            <Text style={styles.clusterMarkerContentTitle}>
              {data?.markers?.length || 0}
            </Text>
          </View>
          <Image source={require('../../assets/eventPopup.png')} />
        </View>
        <Image source={require('../../assets/ellipse.png')} />
      </View>
    );
  };

  const createUnitClusterIcon = (data: any) => {
    return (
      <View style={styles.markerWrapper}>
        <View style={styles.clusterMarkerContent}>
          <View
            style={[
              styles.clusterMarkerContentTitleBox,
              {backgroundColor: '#1b4332'},
            ]}>
            <Text style={styles.clusterMarkerContentTitle}>
              {data?.markers?.length || 0}
            </Text>
          </View>
          <Image source={require('../../assets/eventPopup.png')} />
        </View>
        <Image source={require('../../assets/ellipse.png')} />
      </View>
    );
  };

  console.log(activeTab, eventClusteredData, unitClusteredData, eventMarker, unitMarker, "activeTab");
  

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          ref={ref => (mapRef.current = ref)}
          onRegionDidChange={handleZoomChange}>
          <MapboxGL.Camera zoomLevel={3} centerCoordinate={[78, 30]} />
          <MapboxGL.MarkerView
            id={`currentLocation`}
            coordinate={[76.717873,30.704649]}
            key={'currentLocationMarker'}
          >
            {createCurrentLocationIcon()}
          </MapboxGL.MarkerView>
          {(activeTab === 'All' || activeTab === 'Events') && ( <>
            {eventClusteredData?.map((data: any, index: number) => {
              if (data?.markers?.length > 1) {
                return (
                  <MapboxGL.MarkerView
                    id={`eventclustermarker-${index}`}
                    coordinate={data?.coordinate}
                    key={index}>
                    {createEventClusterIcon(data)}
                  </MapboxGL.MarkerView>
                );
              } else {
                return (
                  <MapboxGL.MarkerView
                    id={`eventmarker-${index}`}
                    coordinate={data?.markers?.[0]?.coordinate}
                    key={index}>
                    {createEventIcon(data,data?.markers?.[0]?.id)}
                  </MapboxGL.MarkerView>
                );
              }
            })}
          </>)}
          {(activeTab === 'All' || activeTab === 'Units') && ( <>
            {unitClusteredData?.map((data: any, index: number) => {
              if (data?.markers?.length > 1) {
                return (
                  <MapboxGL.MarkerView
                    id={`unitclustermarker-${index}`}
                    coordinate={data?.coordinate}
                    key={index}>
                    {createUnitClusterIcon(data)}
                  </MapboxGL.MarkerView>
                );
              } else {
                return (
                  <MapboxGL.MarkerView
                    id={`unitsmarker-${index}`}
                    coordinate={data?.markers?.[0]?.coordinate}
                    key={index}>
                    {createUnitIcon(data, data?.markers?.[0]?.id)}
                  </MapboxGL.MarkerView>
                );
              }
            })}
          </>)}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  clusterMarkerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clusterMarkerContentTitleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    zIndex: 999,
    backgroundColor: '#fca311',
    height: 27,
    width: 31,
  },
  markerContentTitleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 41.5,
    zIndex: 999,
    backgroundColor: '#fca311',
    height: 26,
    width: 62,
  },
  clusterMarkerContentTitle: {
    color: '#ffffff',
    fontWeight: '600',
  },
  unitIconBox: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: '#1b4332',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: -20,
  },
  eventIconBox: {
    width: 32,
    height: 32,
    borderRadius: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: -30,
  },
  currentLocationWrapper: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    width: 140,
    borderRadius: 70,
    backgroundColor: '#00526f14',
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MapBox;
