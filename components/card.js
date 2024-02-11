import { Link } from "expo-router";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";
import FormatedPrice from "../components/price";

export default function CardComponent({ data }) {
  return (
    <Link
      href={{
        pathname: "/cars/[id]",
        params: { id: data.id },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <View >
          <Image
            style={styles.image}
            source={{ uri: data.featuredImage.node.sourceUrl }}
          />
          <View style={styles.textBlock}>
            <Text style={styles.carTitle}>{data.title}</Text>
            <Text style={styles.price}>
              <FormatedPrice price={data.price.edges[0].node.name}/>
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: "48%",
    flex: 1,
    color: "#fff",
    backgroundColor: "gray",
    paddingBottom: 10,
    marginBottom: 10,
    borderRadius: 16,
  },
  image: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
    borderTopRightRadius: 16,    
    borderTopLeftRadius: 16
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
    fontSize: 17,
    fontWeight: '600'
  },
});
