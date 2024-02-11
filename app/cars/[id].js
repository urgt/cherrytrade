import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";
import RenderHtml from "react-native-render-html";
import FormatedPrice from "../../components/price";

export default function singleCar() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [images, setImages] = useState([]);
  const contentWidth = useWindowDimensions().width;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://axmotors-test.axdev.cloud/graphql",
        {
          query: `
                    query BuyACar($id: ID!) {
                        buyACar(id: $id) {
                          acfbuyACar {
                            buyEngine
                            buyMileage
                            buyTransmission
                            buyFirstRegistration
                            buyFuel
                            buyGallery {
                              nodes {
                                sourceUrl
                              }
                            }
                          }
                          content
                          price {
                            edges {
                              node {
                                name
                              }
                            }
                          }
                          title
                          id
                          class {
                            nodes {
                              name
                            }
                          }
                          colors {
                            nodes {
                              name
                            }
                          }
                        }
                    }
                `,
          variables: { id }, 
        }
      );

      const responseData = response.data.data.buyACar; 
      if (!responseData) {
        throw new Error("Data not found in the response");
      }

      
      const imagesArr = responseData.acfbuyACar?.buyGallery?.nodes || [];
      const imagest = imagesArr.map((element) => element.sourceUrl); 

      setData(responseData); 
      setImages(imagest); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={{ flex:1}}>
      <Stack.Screen
            options={{
              title: "",
            }}
          />
      {data.title ? (
        <View>          
          <SliderBox images={images} />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.price}><FormatedPrice price={data.price?.edges[0]?.node.name}/></Text>
            <Text style={styles.title}>Car Information</Text>
            <Text>Engine: {data.acfbuyACar.buyEngine}</Text>
            <Text>Color: {data.colors.nodes[0].name}</Text>
            <Text>Class: {data.class.nodes[0].name}</Text>
            <Text>Mileage: {data.acfbuyACar.buyMileage}</Text>
            <Text>First registration: {data.acfbuyACar.buyFirstRegistration}</Text>
            <Text>Fuel: {data.acfbuyACar.buyFuel}</Text>
            <Text>Transmission: {data.acfbuyACar.buyTransmission}</Text>
            <Text style={styles.title}>Car Description</Text>
            <RenderHtml source={{ html: data.content }} contentWidth={contentWidth}/>
          </View>
        </View>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    padding: 10,
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  price: {
    color: "#d3a188",
    fontWeight: 'bold',
    fontSize: 20,
  },
});
