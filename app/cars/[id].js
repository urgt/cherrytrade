import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";

export default function singleCar() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [images, setImages] = useState([]);

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
                            title
                            content
                            buyACar {
                                buyGallery {
                                    nodes {
                                        sourceUrl
                                    }
                                }
                            }
                            price{
                                edges{
                                    node{
                                        name
                                    }
                                }
                            }
                        }
                    }
                `,
          variables: { id }, // Pass the id variable as a parameter
        }
      );

      const responseData = response.data.data.buyACar; // Retrieve data from the response
      if (!responseData) {
        throw new Error("Data not found in the response");
      }

      const imagesArr = responseData.buyACar?.buyGallery?.nodes || []; // Safely access nodes array
      const imagest = imagesArr.map((element) => element.sourceUrl); // Use map for cleaner code

      setData(responseData); // Set data state
      setImages(imagest); // Set images state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View>
      {images && <SliderBox images={images} />}
      <Text>{data.title}</Text>
      <Text>{data.content}</Text>
      <Text>{data.price?.edges[0]?.node.name} AED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
});
