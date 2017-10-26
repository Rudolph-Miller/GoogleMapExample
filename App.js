/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet, Text, View, Dimensions,
  TouchableWithoutFeedback, AlertIOS
} from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const INITIAL_LATITUDE = 35.6604361;
const INITIAL_LONGITUDE = 139.7289822;
const INITIAL_LATITUDE_DELTA = 0.06;
const INITIAL_LONGITUDE_DELTA = 0.06;

class Marker extends PureComponent {
  constructor() {
    super();

    this.state = {
      isReady: false,
      x: null,
      y: null
    };

    this.markers = [];
  }

  updatePosition() {
    const { map, latitude, longitude } = this.props;

    if (!map) return;

    map.pointForCoordinate({ latitude, longitude }).then(({ x, y }) => {
      this.setState({
        x, y,
        isReady: true
      });
    });
  }
  
  render() {
    const { isReady, x, y } = this.state;

    if (!isReady || x == null || y == null) return <View />;

    return (
      <View
        style={{
          position: 'absolute',
          top: Math.round(y) - 25,
          left: Math.round(x) - 25,
        }} >
        <TouchableWithoutFeedback
          onPress={this.props.onPress} >
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'pink',
                width: 50,
                height: 50,
                borderRadius: 25
              }} >
              <Text
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 'bold'
                }} >
                {this.props.index}
              </Text>
            </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      map: null
    };

    this.markers = [];

    this.onMapReady = this.onMapReady.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  updateMarkers() {
    this.markers.map((marker) => marker.updatePosition());
  }

  onMapReady() {
    this.updateMarkers();
  }

  onRegionChange() {
    this.updateMarkers();
  }

  render() {
    const { map } = this.state;

    const markers = [
      {
        latitude: INITIAL_LATITUDE,
        longitude: INITIAL_LONGITUDE
      },
      {
        latitude: INITIAL_LATITUDE - 0.01,
        longitude: INITIAL_LONGITUDE
      },
      {
        latitude: INITIAL_LATITUDE,
        longitude: INITIAL_LONGITUDE - 0.01
      },
      {
        latitude: INITIAL_LATITUDE + 0.01,
        longitude: INITIAL_LONGITUDE
      },
      {
        latitude: INITIAL_LATITUDE,
        longitude: INITIAL_LONGITUDE + 0.01
      },
    ].map(({ latitude, longitude }, i) => {
      return (
        <Marker
          ref={(marker) => {
            if (marker && this.markers.indexOf(marker) < 0)
              this.markers.push(marker);
          }}
          key={i}
          zIndex={i}
          index={i}
          latitude={latitude}
          longitude={longitude}
          map={map}
          onPress={() => AlertIOS.alert(String(i))} />
      );
    });

    return (
      <View style={styles.container}>
        <MapView
          ref={(map) => {
            if (!this.state.map) this.setState({ map });
          }}
          style={{ height }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: INITIAL_LATITUDE,
            longitude: INITIAL_LONGITUDE,
            latitudeDelta: INITIAL_LATITUDE_DELTA,
            longitudeDelta: INITIAL_LONGITUDE_DELTA
          }}
          zoomEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          onMapReady={this.onMapReady}
          onRegionChange={this.onRegionChange} >
          {markers}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
