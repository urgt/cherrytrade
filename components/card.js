import { Link } from "expo-router";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";

export default function CardComponent({ data }) {
  return (
    <Link
      href={{
        pathname: "/cars/[id]",
        params: { id: data.id },
      }}
      asChild
    >
      <Pressable>
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={{ uri: data.featuredImage.node.sourceUrl }}
          />
          <View style={styles.textBlock}>
            <Text style={styles.carTitle}>{data.title}</Text>
            <Text style={styles.price}>
              {data.price.edges[0].node.name} AED
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    color: "#fff",
    backgroundColor: "gray",
    paddingBottom: 10,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  textBlock: {
    padding: 10,
  },
  carTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FEFFFF",
  },
  price: {
    fontSize: 20,
  },
});
