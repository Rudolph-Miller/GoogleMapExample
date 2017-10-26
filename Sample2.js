/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  Dimensions, Animated, AlertIOS,
  TouchableWithoutFeedback
} from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const INITIAL_LATITUDE = 35.6604361;
const INITIAL_LONGITUDE = 139.7289822;
const INITIAL_LATITUDE_DELTA = 0.06;
const INITIAL_LONGITUDE_DELTA = 0.06;

class Marker extends Component {
  constructor() {
    super();

    this.state = {
      isReady: false,
      x: null,
      y: null
    };
  }

  updatePosition() {
    const { map, latitude, longitude } = this.props;

    if (!map) return;

    map.pointForCoordinate({ latitude, longitude }).then(({ x, y }) => {
      this.setState({
        x, y,
        isReady: true
      });

      /**
      Animated.parallel([
        Animated.timing(this.state.x, {
          toValue: x,
          duration: 1
        }),
        Animated.timing(this.state.y, {
          toValue: y,
          duration: 1
        })
      ]).start();
      */
    });
  }
  
  render() {
    const { isReady, x, y } = this.state;

    if (!isReady) return <View />;

    return (
      <View
        style={{
          position: 'absolute',
          top: y - 25,
          left: x - 25,
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
                Hi!
              </Text>
            </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      map: null
    };

    this.marker = null;

    this.onMapReady = this.onMapReady.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  updateMarker() {
    if (!this.marker) return;

    this.marker.updatePosition();
  }

  onMapReady() {
    this.updateMarker();
  }

  onRegionChange() {
    this.updateMarker();
  }

  render() {
    const { map } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          ref={(map) => {
            if (!this.state.map && map) this.setState({ map });
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
          <Marker
            ref={(marker) => this.marker = marker}
            map={map}
            onPress={() => AlertIOS.alert('Hi!')}
            latitude={INITIAL_LATITUDE}
            longitude={INITIAL_LONGITUDE} />
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
