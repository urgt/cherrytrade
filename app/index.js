import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import axios from "axios";
import CardComponent from "../components/card";

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://axmotors-test.axdev.cloud/graphql",
        {
          query: `
            query {
              allBuyACar(first: 10) {
                nodes {
                  id
                  featuredImage {
                    node {
                    sourceUrl
                  }
                  }
                  slug
                  title
                  price {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }
          `,
        }
      );

      setData(response.data.data.allBuyACar.nodes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <CardComponent data={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    flexGrow: 1,
    justifyContent: "center",
  },
  listContainer: {
    paddingVertical: 8,
  },
});