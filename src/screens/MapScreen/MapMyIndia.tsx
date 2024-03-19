import React, { useState, useRef, useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapmyIndiaGL from 'mapmyindia-map-react-native-beta';
import colors from '../../utlits/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/Auth';

MapmyIndiaGL.setMapSDKKey('b7007d03ff55240db694b0b7563fc5c5'); //place your mapsdkKey
MapmyIndiaGL.setRestAPIKey('b7007d03ff55240db694b0b7563fc5c5'); //your restApiKey
MapmyIndiaGL.setAtlasClientId(
  '96dHZVzsAusaQNUDfa0R4IfyYdjGOl2UVV9uzHlcXxtpFIByOrtb8o0p3fWJUdkaVOnWRV_x2gcVREZIkirJUw==',
); //your atlasClientId key
MapmyIndiaGL.setAtlasClientSecret(
  'lrFxI-iSEg_HTdcIW4gONEtBXY4PODzJL2pFfHUZNDbJ9tvQRgZ7aXYXyo2Dbwu82s7EwZKCbNHcH3Ls4VqH5YOcBfMiQELJ',
); //your atlasClientSecret key

const MapMyIndia = ({
  eventMarker,
  unitMarker,
  activeTab,
  handleMarkerEventsClick,
  handleMarkerUnitClick,
  currentLocation
}: any) => {

  
  const { user } = useAuth();
  const mmiRef = useRef<any>(null);
  const [eventClusteredData, setEventClusteredData] = useState<any>([]);
  const [unitClusteredData, setUnitClusteredData] = useState<any>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(8);
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
    markers: any[] | undefined,
    zoomLevel: number,
    currentRegion: [number, number, number, number],
  ) => {
    const CLUSTER_RADIUS = calculateClusterRadius(zoomLevel); // Calculate cluster radius based on zoom level

    const clusteredMarkers: any[] = [];
    if (!markers || markers.length === 0) {
      return []; // Return empty array if markers is undefined or empty
    }

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
    if (mmiRef.current) {
      const currentZoom = await mmiRef.current.getZoom();
      const currentRegion = await mmiRef.current.getVisibleBounds();
      setRegion([
        currentRegion[0][0],
        currentRegion[0][1],
        currentRegion[1][0],
        currentRegion[1][1],
      ]);
      setZoomLevel(currentZoom);
    }
  };

  const createCurrentLocationIcon = () => {
    return (
      <Pressable style={styles.currentLocationWrapper} onPress={() => handleMarkerUnitClick(user?.unitId)}>
        <View style={styles.markerWrapper}>
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
        </View>
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

  useEffect(() => {
    handleZoomChange();
  },[mmiRef?.current])

  // console.log(activeTab, eventClusteredData, unitClusteredData, eventMarker, unitMarker, "activeTab");


  return (
    <View style={{flex: 1}}>
      <MapmyIndiaGL.MapView
        ref={ref => (mmiRef.current = ref)}
        style={{flex: 1}}
        // onPress={handleZoomChange}
      >
        <MapmyIndiaGL.Camera
          zoomLevel={4}
          // minZoomLevel={4}
          // maxZoomLevel={15}
          centerCoordinate={[78, 26]}
          // centerCoordinate={currentLocation}
          
        />
        <MapmyIndiaGL.PointAnnotation
          key={'current-location-marker'}
          title="xyz"
          id={`current-location-marker`}
          coordinate={[76.717873,30.704649]}
        >
          {createCurrentLocationIcon()}
          </MapmyIndiaGL.PointAnnotation>

         {(activeTab === 'All' || activeTab === 'Events') && ( <>
          {eventClusteredData?.map((data: any, index: number) => {
              if (data?.markers?.length > 1) {
                return (
                  <MapmyIndiaGL.PointAnnotation
                    key={index}
                    title="xyz"
                    id={`eventclustermarker-${index}`}
                    // ref={annotationRef}
                    coordinate={data.coordinate}
                    // onSelected={() => handleMarkerEventsClick(Item.id)}
                  >
                    {createEventClusterIcon(data)}
                  </MapmyIndiaGL.PointAnnotation>
                );
              } else {
                return (
                  <MapmyIndiaGL.PointAnnotation
                    key={index}
                    title="xyz"
                    id={`eventsmarker-${index}`}
                    // ref={annotationRef}
                    coordinate={data?.markers?.[0]?.coordinate}
                    // onSelected={() => handleMarkerEventsClick(Item.id)}
                  >
                    {createEventIcon(data, data?.markers?.[0]?.id)}
                  </MapmyIndiaGL.PointAnnotation>
                );
              }
            })}
          </>)}
          {(activeTab === 'All' || activeTab === 'Units') && ( <>
            {unitClusteredData?.map((data: any, index: number) => {
              if (data?.markers?.length > 1) {
                return (
                  <MapmyIndiaGL.PointAnnotation
                    key={index}
                    title="xyz"
                    id={`unitclustermarker-${index}`}
                    // ref={annotationRef}
                    coordinate={data.coordinate}
                    // onSelected={() => handleMarkerEventsClick(Item.id)}
                  >
                    {createUnitClusterIcon(data)}
                  </MapmyIndiaGL.PointAnnotation>
                );
              } else {
                return (
                  <MapmyIndiaGL.PointAnnotation
                    id={`eventsmarker-${index}`}
                    title="xyz"
                    // ref={annotationRef}
                    coordinate={data?.markers?.[0]?.coordinate}
                    // onSelected={() => handleMarkerEventsClick(Item.id)}
                  >
                    {createUnitIcon(data, data?.markers?.[0]?.id)}
                  </MapmyIndiaGL.PointAnnotation>
                );
              }
            })}
          </>)}
        {/* {eventMarker.map(
          (Item: any) =>
            (activeTab === 'All' || activeTab === 'Events') && (
              <MapmyIndiaGL.PointAnnotation
                key={Item.id}
                title="xyz"
                id={Item.id}
                // ref={annotationRef}
                coordinate={Item.coordinate}
                onSelected={() => handleMarkerEventsClick(Item.id)}>
                <Image
                  source={require('../../assets/download.jpeg')}
                  style={{height: 30, width: 30}}
                />
                <MapmyIndiaGL.Callout
                  title="xyz"
                  containerStyle={{
                    height: 30,
                    width: 30,
                    borderRadius: 2,
                    backgroundColor: 'red',
                    marginBottom: 7,
                    flexShrink: 0,
                    alignContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => console.log('hellloleolo')}>
                    <Text style={{color: 'black', textAlign: 'center'}}>3</Text>
                  </TouchableOpacity>
                </MapmyIndiaGL.Callout>
              </MapmyIndiaGL.PointAnnotation>
            ),
        )}
        {unitMarker.map(
          (Item: any) =>
            (activeTab === 'All' || activeTab === 'Units') && (
              <MapmyIndiaGL.PointAnnotation
                key={Item.id}
                title="xyz"
                id={Item.id}
                coordinate={Item.coordinate}
                onSelected={() => handleMarkerUnitClick(Item.id)}>
                <Image
                  source={require('../../assets/background.png')}
                  style={{height: 30, width: 30}}
                />
                <MapmyIndiaGL.Callout
                  title="xyz"
                  containerStyle={{
                    height: 30,
                    width: 30,
                    borderRadius: 2,
                    backgroundColor: 'red',
                    marginBottom: 7,
                    flexShrink: 0,
                    alignContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => console.log('hellloleolo')}>
                    <Text style={{color: 'black', textAlign: 'center'}}>3</Text>
                  </TouchableOpacity>
                </MapmyIndiaGL.Callout>
              </MapmyIndiaGL.PointAnnotation>
            ),
        )} */}
      </MapmyIndiaGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default MapMyIndia;
