import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { ListItem, Text } from 'react-native-elements';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export default function WeatherListItem({item}) {
    const DATE = new Date(item.dt * 1000);
    return (
        <ListItem containerStyle={{backgroundColor: "#1e1e1e", marginTop: 15}} bottomDivider >
            <View style={{flexDirection: "column"}}>
                <View style={{width: "100%", textAlign: 'center'}}>
                    <Text
                        style={styles.text}
                        h3
                        h3Style={{ color: "#ffffff" }}
                    >
                        Forecast temperature
                    </Text>
                </View>
                <View style={{width: "100%", textAlign: 'center'}}>
                    <Text
                        style={styles.text}
                        h3
                        h3Style={{ color: "#ffffff" }}
                    >
                        {`${MONTH_LABELS[DATE.getMonth()]} ${DATE.getDate()}, ${DATE.getFullYear()}`}
                    </Text>
                </View>
                <View style={{flexDirection: "row", textAlign: 'center'}}>
                    <View style={{flex:1, textAlign: 'center'}}>
                        <Text
                            style={styles.text}
                            h3
                            h3Style={{ color: "#ffffff" }}
                        >
                            Min
                        </Text>
                    </View>
                    <View style={{flex:1, textAlign: 'center'}}>
                        <Text
                            style={styles.text}
                            h3
                            h3Style={{ color: "#ffffff" }}
                        >
                            Max
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection: "row", textAlign: 'center'}}>
                    <View style={{flex:1, textAlign: 'center'}}>
                        <Text
                            style={styles.text}
                            h3
                            h3Style={{ color: "#ffffff" }}
                        >
                            {`${item.temp.min} °C`}
                        </Text>
                    </View>
                    <View style={{flex:1, textAlign: 'center'}}>
                        <Text
                            style={styles.text}
                            h3
                            h3Style={{ color: "#ffffff" }}
                        >
                            {`${item.temp.max} °C`}
                        </Text>
                    </View>
                </View>
            </View>
        </ListItem>
    )
}

const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      padding: 5,
    }
});