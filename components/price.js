import { Text } from "react-native";

export default function FormatedPrice(price) {
    let formattedPrice = price.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return <Text>{formattedPrice} AED</Text>;
}