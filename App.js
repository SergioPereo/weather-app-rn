import React, {useState} from 'react'
import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import { SearchBar, Text, ListItem } from 'react-native-elements';
import axios from 'axios';
import Constants from "expo-constants";
import WeatherListItem from "./src/components/WeatherListItem"

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

function OptionItem({item, handleOptionSelected}) {
  const DATE = new Date(item.dt * 1000);
  return (
      <ListItem containerStyle={{backgroundColor: "#1e1e1e", marginTop: 15}} onPress={() => handleOptionSelected(item)} bottomDivider >
        <Text style={{color: "#ffffff"}}>{`${item.country}, ${item.state}, ${item.city_name}.`}</Text>
      </ListItem>
  )
}


export default function App() {

  const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/onecall";
  const RESERVEMOS_BASE_URL = "https://search.reservamos.mx/api/v2/places";
  const API_KEY = Constants.manifest.extra.openWeatherApiKey
  const [query, setQuery] = useState("");
  const [isQuering, setIsQuering] = useState(false)
  const [direction, setDirection] = useState("")
  const [dailyWeather, setDailyWeather] = useState([])
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [maxHumidity, setMaxHumidity] = useState("")

  const handleOptionSelected = async (item) => {
    const weather = await axios.get(OPEN_WEATHER_BASE_URL, {
      params: {
        lat: item.lat,
        lon: item.long,
        exclude: "hourly,minutely",
        units: "metric",
        appid: API_KEY
      }
    })

    

    let maxHDt = ""
    let humidity = 0
    weather.data.daily.map(day => {
      console.log(day.humidity)
      if(humidity < day.humidity){
        humidity = day.humidity
        maxHDt = day.dt
      }
    })

    setDirection(`${item.country}, ${item.state}, ${item.city_name}.`)
    setDailyWeather(weather.data.daily)
    setMaxHumidity(maxHDt)
    setCurrent(weather.data.current)
  }

  const updateSearch = async (search) => {
    const coords = await axios.get(RESERVEMOS_BASE_URL, {
      params: {
        q: query
      }
    })
    setQuery(search);
    setOptions(coords.data)
  }

  const handleSearch = async() => {
    if(query.length > 0){
      if(!isQuering){
        try{
          setIsQuering(true)
  
          const coords = await axios.get(RESERVEMOS_BASE_URL, {
            params: {
              q: query
            }
          })
          const weather = await axios.get(OPEN_WEATHER_BASE_URL, {
            params: {
              lat: coords.data[0].lat,
              lon: coords.data[0].long,
              exclude: "hourly,minutely",
              units: "metric",
              appid: API_KEY
            }
          })
          let maxHDt = ""
          let humidity = 0
          weather.data.daily.map(day => {
            console.log(day.humidity)
            if(humidity < day.humidity){
              humidity = day.humidity
              maxHDt = day.dt
            }
          })
          setMaxHumidity(maxHDt)
          setDirection(`${coords.data[0].country}, ${coords.data[0].state}, ${coords.data[0].city_name}.`)
          setDailyWeather(weather.data.daily)
          setCurrent(weather.data.current)
          setIsQuering(false)
        } catch(error){
          setIsQuering(false)
          console.log(error)
        }
      } else {
        console.log("Is quering... wait!")
      }
    }
  }

  const keyExtractor = (item, index) => index.toString()
  const CURRENT_DATE = current !== null ? new Date(current.dt * 1000) : 0;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        backgroundColor: "#626366d3"
      }}
    >
      <SearchBar
        containerStyle={Platform.OS==="android"? {justifyContent:'center', height:20, width: "105%"}: {justifyContent:'center', height:18, width: "105%"} }
        placeholder="City..."
        onChangeText={updateSearch}
        onSubmitEditing={handleSearch}
        value={query}
      />
      <ScrollView>
        {
          options.map((option, index) => {
            return (
              <OptionItem key={index.toString()} item={option} handleOptionSelected={handleOptionSelected}/>
            )
          })
        }
      </ScrollView>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{marginTop: 18}}>
              <Text
                style={styles.text}
                h3
                h3Style={{ color: "#ffffff" }}>
                {direction}
              </Text>
            </View>
            {current !== null ? (
              <ListItem containerStyle={{backgroundColor: "#1e1e1e", marginTop: 15}} bottomDivider >
                  <View style={{flexDirection: "column", flex:1}}>
                      <View style={{width: "100%", textAlign: 'center'}}>
                          <Text
                              style={styles.text}
                              h3
                              h3Style={{ color: "#ffffff" }}
                          >
                              Temperature now
                          </Text>
                      </View>
                      <View style={{width: "100%", textAlign: 'center'}}>
                          <Text
                              style={styles.text}
                              h3
                              h3Style={{ color: "#ffffff" }}
                          >
                              {`${MONTH_LABELS[CURRENT_DATE.getMonth()]} ${CURRENT_DATE.getDate()}, ${CURRENT_DATE.getFullYear()}`}
                          </Text>
                      </View>
                      <View style={{width: "100%", textAlign: 'center'}}>
                          <Text
                              style={styles.text}
                              h3
                              h3Style={{ color: "#ffffff" }}
                          >
                              {`${current.temp} °C`}
                          </Text>
                      </View>
                  </View>
              </ListItem>
            ):(<></>)}
          </>
        }
        keyExtractor={keyExtractor}
        data={dailyWeather}
        renderItem={({item})=> <WeatherListItem item={item} maxHumidity={maxHumidity}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 5,
  }
});
