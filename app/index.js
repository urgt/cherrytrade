import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import CardComponent from "../components/card";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import "../components/ignoreWarnings";

export default function Page() {
  const [data, setData] = useState([]);
  const [size, setSize] = useState(20);
  const [cursor, setCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://axmotors-test.axdev.cloud/graphql",
        {
          query: `
            query ($first: Int) {
              allBuyACar(first: $first) {
                nodes {
                  id
                  featuredImage {
                    node {
                      sourceUrl(size: MEDIUM_LARGE)
                    }
                  }
                  title
                  buyACarId
                  price {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
                pageInfo {
                  offsetPagination {
                    total
                  }
                  hasNextPage
                  endCursor
                }
              }
            }
          `,
          variables: { first: size },
        }
      );

      setData(response.data.data.allBuyACar.nodes);
      if (response.data.data.allBuyACar.pageInfo.hasNextPage) {
        setCursor(response.data.data.allBuyACar.pageInfo.endCursor);
        setHasNextPage(response.data.data.allBuyACar.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMoreData = async () => {
    if (hasNextPage) {
      try {
        const response = await axios.post(
          "https://axmotors-test.axdev.cloud/graphql",
          {
            query: `
              query ($first: Int, $after: String) {
                allBuyACar(first: $first, after: $after) {
                  nodes {
                    id
                    featuredImage {
                      node {
                        sourceUrl(size: MEDIUM_LARGE)
                      }
                    }
                    title
                    buyACarId
                    price {
                      edges {
                        node {
                          name
                        }
                      }
                    }
                  }
                  pageInfo {
                    offsetPagination {
                      total
                    }
                    hasNextPage
                    endCursor
                  }
                }
              }
            `,
            variables: { first: size, after: cursor },
          }
        );

        const newNodes = response.data.data.allBuyACar.nodes.filter(
          (node) =>
            !data.some(
              (existingNode) => existingNode.buyACarId === node.buyACarId
            )
        );
        setData([...data, ...newNodes]);

        if (response.data.data.allBuyACar.pageInfo.hasNextPage) {
          setCursor(response.data.data.allBuyACar.pageInfo.endCursor);
          setHasNextPage(response.data.data.allBuyACar.pageInfo.hasNextPage);
        } else {
          setHasNextPage(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  function Loader() {
    return <View>{hasNextPage && <ActivityIndicator size={"large"} />}</View>;
  }

  function SearchInput() {
    return (
      <View>
        <TextInput
          placeholder="Search"
          inputMode="search"
          clearButtonMode="always"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 10,
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "", headerShown: false }} />
      <FlatList
        data={data}
        renderItem={({ item }) => <CardComponent data={item} />}
        keyExtractor={(item, index) => index}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        ListHeaderComponent={SearchInput}
        ListFooterComponent={Loader}
        refreshing={isLoading}
        onRefresh={fetchData}
        onEndReached={loadMoreData}
        onEndReachedThreshold={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
});
